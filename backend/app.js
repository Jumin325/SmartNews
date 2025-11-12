import express from 'express';
import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(express.json());

// PostgreSQL 연결
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 뉴스 수집 API 엔드포인트
app.post('/collect', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: 'keyword required' });

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=ko&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (!data.articles) return res.status(500).json({ error: 'API returned no data' });

    for (const a of data.articles.slice(0, 5)) { // 5개만 예시 저장
      await pool.query(
        `INSERT INTO articles (keyword, title, content, source, published_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [keyword, a.title, a.content, a.source.name, a.publishedAt]
      );
    }

    res.json({ status: 'ok', inserted: data.articles.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to collect news' });
  }
});

app.listen(5000, () => console.log('✅ Backend running on port 5000'));
