from fastapi import FastAPI
from routes.summarize_route import router as summarize_router
from routes.sentiment_route import router as sentiment_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "SmartNews AI module running"}

# 라우터 등록
app.include_router(summarize_router)
app.include_router(sentiment_router)