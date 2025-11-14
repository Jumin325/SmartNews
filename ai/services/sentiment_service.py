from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "nlptown/bert-base-multilingual-uncased-sentiment"

tokenizer = AutoTokenizer.from_pretrained(model_name)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(model_name)

def analyze_sentiment(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    outputs = sentiment_model(**inputs)
    
    probs = torch.softmax(outputs.logits, dim=1)
    label_id = torch.argmax(probs).item()  # 0~4 => 1~5 점수
    score = label_id + 1

    if score <= 2:
        sentiment = "부정"
    elif score == 3:
        sentiment = "중립"
    else:
        sentiment = "긍정"

    confidence = float(probs[0][label_id])

    return sentiment, confidence