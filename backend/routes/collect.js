// 뉴스 수집 후 articles 저장 + 바로 summarize 호출하여 news_summary에 저장하는 라우터

import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "keyword required" });

  try {
    // 1) NewsAPI에서 기사 수집
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=ko&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "API returned no data" });
    }

    // 2) 저장된 기사들의 요약 결과 배열
    const summarizedResults = [];

    for (const a of data.articles.slice(0, 5)) {
      // ① articles에 원문 저장
      const insertResult = await pool.query(
        `INSERT INTO articles (keyword, title, content, source, published_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, title`,
        [keyword, a.title, a.content, a.source?.name || "", a.publishedAt]
      );

      const article = insertResult.rows[0];

      // ② summarize 자동 호출
      const aiRes = await fetch(process.env.BACKEND_URL + `/summarize/${article.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const summaryData = await aiRes.json();

      // ③ 프론트에 반환할 배열 구성
      summarizedResults.push({
        article_id: article.id,
        title: article.title,
        summary_short: summaryData.summary_short,
        summary_long: summaryData.summary_long
      });
    }

    // 3) 프론트로 최종 요약된 기사 리스트 반환
    res.json({
      status: "ok",
      keyword,
      results: summarizedResults
    });

  } catch (err) {
    console.error("❌ Collect Error:", err);
    res.status(500).json({ error: "failed to collect and summarize" });
  }
});

export default router;