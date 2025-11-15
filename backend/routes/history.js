import express from "express";
import pool from "../db.js";

const router = express.Router();

// 전체 요약 리스트
router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT id, keyword, title, sentiment, published_at
     FROM news_summary
     ORDER BY id DESC LIMIT 50`
  );
  res.json(result.rows);
});

// 특정 ID 상세 조회
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT * FROM news_summary WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
});

export default router;