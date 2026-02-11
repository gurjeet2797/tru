from fastapi import APIRouter, HTTPException

from app.models.schemas import ChatRequest, ChatResponse
from app.services.llm import generate_response

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        result = await generate_response(
            user_text=req.user_text,
            previous_response_id=req.previous_response_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
