from fastapi import APIRouter
from pydantic import BaseModel
from services.summarize_service import summarize_short, summarize_long

router = APIRouter()

class TextIn(BaseModel):
    text: str

@router.post("/summarize")
def summarize(req: TextIn):
    short = summarize_short(req.text)
    long = summarize_long(req.text)

    return {
        "summary_short": short,
        "summary_long": long
    }