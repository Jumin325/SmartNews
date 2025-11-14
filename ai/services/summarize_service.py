from config import client

def summarize_short(text: str):
    prompt = f"다음 기사를 1~3줄로 간단히 요약해줘:\n\n{text}"

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150
    )
    return res.choices[0].message.content


def summarize_long(text: str):
    prompt = f"다음 기사를 5~8줄로 자세하게 요약해줘:\n\n{text}"

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return res.choices[0].message.content