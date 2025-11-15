import { useState } from "react";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [summaryList, setSummaryList] = useState([]);

  // 🔥 추가: result 출력 토글
  const [showResult, setShowResult] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🔹 뉴스 수집 실행
  const handleCollect = async () => {
    try {
      const res = await fetch(`${API_URL}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      setShowResult(true);   // ←🔥 자동으로 결과창 보여주기

    } catch (err) {
      console.error("❌ 뉴스 수집 오류:", err);
      setResult(`❌ 오류 발생: ${err.message}`);
      setShowResult(true);
    }
  };

  // 🔹 DB → 요약 + 감정 결과 가져오기
  const loadSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/news/summary`);
      const data = await res.json();
      setSummaryList(data);
    } catch (err) {
      console.error("❌ 요약 조회 오류:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">📰 SmartNews - 뉴스 수집 & 감정 분석</h2>

      {/* 🔍 검색 카드 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="키워드를 입력하세요 (예: AI, 클라우드...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={handleCollect} className="btn primary">
          뉴스 수집
        </button>

        <button onClick={loadSummary} className="btn secondary">
          요약 불러오기
        </button>
      </div>

      {/* 🔽 수집 결과 토글 버튼 */}
      <button className="btn toggle" onClick={() => setShowResult(!showResult)}>
        {showResult ? "수집 결과 숨기기" : "수집 결과 보기"}
      </button>

      {/* 📂 수집 결과 출력 (토글 적용) */}
      {showResult && (
        <pre className="result-box">
          {(() => {
            try {
              return typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2);
            } catch {
              return "⚠ 결과 렌더링 오류 발생";
            }
          })()}
        </pre>
      )}

      {/* 📋 요약 + 감정 카드 출력 */}
      <div className="summary-section">
        <h3>📋 뉴스 요약 + 감정 분석 결과</h3>

        {summaryList.length === 0 && <p>데이터가 없습니다.</p>}

        {summaryList.map((item) => (
          <div key={item.id} className="card">
            <h4>{item.title}</h4>

            <p className="summary">{item.summary_short}</p>

            <p className={`sentiment ${item.sentiment}`}>
              {item.sentiment === "긍정" && "😊 긍정"}
              {item.sentiment === "부정" && "😡 부정"}
              {item.sentiment === "중립" && "😐 중립"}
            </p>

            <small className="date">
              {new Date(item.published_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;