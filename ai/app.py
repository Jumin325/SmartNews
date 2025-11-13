from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# OpenAI 클라이언트 생성 (openai.ChatCompletion 사용 불가 → 이 방식만 가능)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class TextIn(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "✅ SmartNews AI module running"}

@app.post("/summarize")
def summarize(req: TextIn):
    text = req.text

    # 🔹 간단 요약 (1~3줄)
    short_prompt = f"다음 기사를 1~3줄로 간단히 요약해줘:\n\n{text}"

    short_res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": short_prompt}],
        max_tokens=150
    )

    summary_short = short_res.choices[0].message.content

    # 🔹 심화 요약 (5~8줄)
    long_prompt = f"다음 기사를 5~8줄로 자세하게 요약해줘:\n\n{text}"

    long_res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": long_prompt}],
        max_tokens=300
    )

    summary_long = long_res.choices[0].message.content

    return {
        "summary_short": summary_short,
        "summary_long": summary_long
    }

@app.post("/sentiment")
def sentiment(req: TextIn):
    # 감정 분석은 나중에 구현
    return {"sentiment": "중립"}