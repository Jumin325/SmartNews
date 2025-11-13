// 📌 PostgreSQL 연결 모듈 pg 불러오기
import pkg from "pg";
const { Pool } = pkg;

// ✅ DB 연결 풀(Pool) 생성
// 환경변수(.env)에서 설정을 읽어와 PostgreSQL과 연결
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Pool을 외부에서 사용할 수 있도록 export
// 다른 파일에서 import pool → 쿼리 실행 가능
export default pool;