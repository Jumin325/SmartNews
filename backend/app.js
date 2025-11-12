import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  res.send("✅ SmartNews Backend is running");
});

app.get("/news", async (req, res) => {
  const result = await pool.query("SELECT * FROM news_summary LIMIT 10;");
  res.json(result.rows);
});

app.listen(5000, () => {
  console.log("🚀 Backend server running on port 5000");
});