import { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [summaryList, setSummaryList] = useState([]);

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
    } catch (err) {
      console.error("❌ 뉴스 수집 오류:", err);
      setResult(`❌ 오류 발생: ${err.message}`);
    }
  };

  // 🔹 DB에 저장된 뉴스 요약 + 감정 결과 가져오기
  const loadSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/news/summary`);
      const data = await res.json();
      setSummaryList(data);
    } catch (err) {
      console.error("❌ 요약 조회 오류:", err);
    }
  };

  // 🔹 감정 배지 스타일
  const sentimentStyle = (sentiment) => {
    if (sentiment === "긍정") return { color: "#2ecc71", fontWeight: "bold" };
    if (sentiment === "부정") return { color: "#e74c3c", fontWeight: "bold" };
    return { color: "#f1c40f", fontWeight: "bold" }; // 중립
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>📰 SmartNews - 뉴스 수집 & 감정 분석</h2>

      {/* 키워드 입력 */}
      <input
        type="text"
        placeholder="키워드 입력 (예: AI)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />

      <button onClick={handleCollect} style={{ marginRight: "10px" }}>
        뉴스 수집 실행
      </button>

      <button onClick={loadSummary}>
        요약 + 감정 결과 불러오기
      </button>

      {/* 수집 결과 출력 */}
      <pre style={{ marginTop: "20px", textAlign: "left", width: "80%", margin: "auto" }}>
        {result}
      </pre>

      {/* 요약 + 감정 결과 출력 */}
      <div style={{ marginTop: "40px", width: "80%", margin: "40px auto" }}>
        <h3>📋 뉴스 요약 + 감정 분석 결과</h3>
        {summaryList.length === 0 && <p>아직 데이터가 없습니다.</p>}

        {summaryList.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <h4>{item.title}</h4>

            <p>{item.summary_short}</p>

            <p style={sentimentStyle(item.sentiment)}>
              {item.sentiment === "긍정" && "😊 긍정"}
              {item.sentiment === "부정" && "😡 부정"}
              {item.sentiment === "중립" && "😐 중립"}
            </p>

            <small>
              {new Date(item.published_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
