CREATE TABLE IF NOT EXISTS news_summary (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    title TEXT,
    summary_short TEXT,
    summary_long TEXT,
    sentiment VARCHAR(10),
    published_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    title TEXT,
    content TEXT,
    source VARCHAR(255),
    published_at TIMESTAMP
);