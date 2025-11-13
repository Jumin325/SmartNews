// article id를 받아서 AI 요약 결과를 news_summary 테이블에 저장하는 라우터

import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const articleId = req.params.id;

  try {
    // ① article 원문 가져오기
    const result = await pool.query("SELECT * FROM articles WHERE id=$1", [articleId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const article = result.rows[0];

    // ② AI 요약 생성 요청
    const aiResponse = await fetch(process.env.AI_API + "/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: article.content })
    });

    const data = await aiResponse.json();

    // ③ news_summary INSERT
    await pool.query(
      `INSERT INTO news_summary (keyword, title, summary_short, summary_long)
       VALUES ($1, $2, $3, $4)`,
      [article.keyword, article.title, data.summary_short, data.summary_long]
    );

    res.json({
      article_id: articleId,
      title: article.title,
      summary_short: data.summary_short,
      summary_long: data.summary_long
    });

  } catch (error) {
    console.error("❌ Summarize Error:", error);
    return res.status(500).json({ error: "Failed to summarize article" });
  }
});

export default router;