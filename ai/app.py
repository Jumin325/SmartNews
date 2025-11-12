from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TextIn(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "✅ SmartNews AI module running"}

@app.post("/summarize")
def summarize(req: TextIn):
    return {"summary": f"요약 결과 예시: {req.text[:30]}..."}

@app.post("/sentiment")
def sentiment(req: TextIn):
    return {"sentiment": "중립"}