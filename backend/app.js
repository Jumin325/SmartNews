// 📌 Express와 필요한 라이브러리 불러오기
import express from "express";
import cors from "cors";

// 📌 기능별 라우트 파일 불러오기
// 1단계: 뉴스 수집
// 2단계: 요약 생성
import collectRouter from "./routes/collect.js";
import summarizeRouter from "./routes/summarize.js";
import newsRouter from "./routes/news.js";
import historyRouter from "./routes/history.js";

const app = express();

// ✅ CORS 설정
// 프론트엔드(React)에서 백엔드로 요청할 수 있도록 허용
app.use(
  cors({
    origin: ["http://localhost:3000"],  // 허용할 프론트 주소
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ JSON 파싱 설정
// 클라이언트에서 온 JSON 데이터를 자동으로 읽어줌
app.use(express.json());

// ✅ 라우트 등록
// /collect 경로로 들어오는 요청은 collectRouter에서 처리
app.use("/collect", collectRouter);
app.use("/summarize", summarizeRouter);
app.use("/news", newsRouter);
app.use("/history", historyRouter);

// ✅ 서버 실행 (5000번 포트 리스닝)
app.listen(5000, () => {
  console.log("🚀 Backend server running on port 5000");
});