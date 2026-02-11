from pydantic import BaseModel


class ChatRequest(BaseModel):
    user_text: str
    previous_response_id: str | None = None


class Source(BaseModel):
    title: str
    url: str


class Lenses(BaseModel):
    physics: str
    math: str
    human: str
    contemplative: str


class Confidence(BaseModel):
    confident: list[str]
    uncertain: list[str]


class ChatResponse(BaseModel):
    response_id: str
    main_text: str
    lenses: Lenses
    confidence: Confidence
    sources: list[Source]
