from fastapi import APIRouter
from pydantic import BaseModel
from services.sentiment_service import analyze_sentiment

router = APIRouter()

class TextIn(BaseModel):
    text: str

@router.post("/sentiment")
def sentiment(req: TextIn):
    label, confidence = analyze_sentiment(req.text)
    return {
        "sentiment": label,
        "confidence": confidence
    }