import json
import os
import re
from functools import lru_cache

from dotenv import load_dotenv
from openai import AsyncOpenAI

from app.models.schemas import ChatResponse, Confidence, Lenses, Source
from app.services.prompts import FACT_SPINE_PROMPT, SYNTHESIS_PROMPT

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

MODEL = "gpt-4o"


@lru_cache(maxsize=1)
def _get_client() -> AsyncOpenAI:
    """Lazily create the OpenAI client so .env is loaded first."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set in environment or .env")
    return AsyncOpenAI(api_key=api_key)


async def generate_response(
    user_text: str,
    previous_response_id: str | None = None,
) -> ChatResponse:
    # ------------------------------------------------------------------
    # Stage A: Fact Spine -- grounded factual summary with sources
    # ------------------------------------------------------------------
    fact_messages = [
        {"role": "developer", "content": FACT_SPINE_PROMPT},
        {"role": "user", "content": user_text},
    ]

    client = _get_client()

    fact_resp = await client.responses.create(
        model=MODEL,
        input=fact_messages,
        **({"previous_response_id": previous_response_id} if previous_response_id else {}),
    )

    fact_raw = fact_resp.output_text
    fact_response_id = fact_resp.id

    # Parse fact spine and sources
    fact_text, sources = _parse_fact_spine(fact_raw)

    # ------------------------------------------------------------------
    # Stage B: Perspective Synthesis -- four lenses + confidence
    # ------------------------------------------------------------------
    synth_messages = [
        {"role": "developer", "content": SYNTHESIS_PROMPT},
        {
            "role": "user",
            "content": (
                f"USER QUESTION:\n{user_text}\n\n"
                f"FACT SPINE:\n{fact_text}"
            ),
        },
    ]

    synth_resp = await client.responses.create(
        model=MODEL,
        input=synth_messages,
        previous_response_id=fact_response_id,
    )

    synth_raw = synth_resp.output_text.strip()
    response_id = synth_resp.id

    # Parse the JSON response from the synthesis stage
    parsed = _parse_synthesis(synth_raw)

    return ChatResponse(
        response_id=response_id,
        main_text=parsed.get("main_text", ""),
        lenses=Lenses(
            physics=parsed.get("lenses", {}).get("physics", ""),
            math=parsed.get("lenses", {}).get("math", ""),
            human=parsed.get("lenses", {}).get("human", ""),
            contemplative=parsed.get("lenses", {}).get("contemplative", ""),
        ),
        confidence=Confidence(
            confident=parsed.get("confidence", {}).get("confident", []),
            uncertain=parsed.get("confidence", {}).get("uncertain", []),
        ),
        sources=sources,
    )


def _parse_fact_spine(raw: str) -> tuple[str, list[Source]]:
    """Split the fact spine text from the ---SOURCES--- JSON block."""
    sources: list[Source] = []
    fact_text = raw

    if "---SOURCES---" in raw:
        parts = raw.split("---SOURCES---", 1)
        fact_text = parts[0].strip()
        try:
            raw_sources = json.loads(parts[1].strip())
            sources = [
                Source(title=s.get("title", ""), url=s.get("url", ""))
                for s in raw_sources
                if isinstance(s, dict)
            ]
        except (json.JSONDecodeError, IndexError):
            pass

    return fact_text, sources


def _parse_synthesis(raw: str) -> dict:
    """Extract the JSON object from the synthesis response."""
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to extract JSON object from raw (e.g. if wrapped in extra text)
    match = re.search(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", text, re.DOTALL)
    if match:
        try:
            parsed = json.loads(match.group())
            if isinstance(parsed.get("main_text"), str):
                return parsed
        except (json.JSONDecodeError, IndexError):
            pass

    # Last resort: use first non-empty paragraph as main_text, never show raw JSON
    lines = [l.strip() for l in text.split("\n") if l.strip() and not l.strip().startswith("{")]
    fallback_text = lines[0] if lines else "I couldn't structure that response clearly. Please try again."
    return {
        "main_text": fallback_text,
        "lenses": {
            "physics": "",
            "math": "",
            "human": "",
            "contemplative": "",
        },
        "confidence": {
            "confident": [],
            "uncertain": ["Response could not be parsed into structured format."],
        },
    }
