import express from "express";
import pool from "../db.js";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { keyword } = req.body;

  try {
    // 1) 뉴스 API 호출
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=ko&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "API returned no data" });
    }

    const results = [];

    for (const a of data.articles.slice(0, 5)) {
      // 2) 요약 생성 (AI API)
      const summaryResponse = await fetch(`${process.env.AI_API}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: a.content }),
      });
      const summaryData = await summaryResponse.json();

      // 3) 감정 분석 (AI API)
      const sentimentResponse = await fetch(`${process.env.AI_API}/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: a.content }),
      });
      const sentimentData = await sentimentResponse.json();

      const sentimentLabel = sentimentData.sentiment;  // 긍정/부정/중립

      // 4) DB 저장
      const insert = await pool.query(
        `INSERT INTO news_summary (keyword, title, summary_short, summary_long, sentiment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [keyword, a.title, summaryData.summary_short, summaryData.summary_long, sentimentLabel]
      );

      results.push(insert.rows[0]);
    }

    res.json(results);

  } catch (err) {
    console.error("❌ Collect Error:", err);
    res.status(500).json({ error: "Collect failed" });
  }
});

export default router;