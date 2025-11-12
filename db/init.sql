CREATE TABLE IF NOT EXISTS news_summary (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    title TEXT,
    summary_short TEXT,
    summary_long TEXT,
    sentiment VARCHAR(10),
    published_at TIMESTAMP DEFAULT NOW()
);