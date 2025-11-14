import express from "express";
import pool from "../db.js";  // pg Pool

const router = express.Router();

// 뉴스 요약 + 감정 분석 리스트 가져오기
router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, keyword, title, summary_short, summary_long, sentiment, published_at
      FROM news_summary
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching news summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;