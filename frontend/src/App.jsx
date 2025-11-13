import { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]); // 요약된 기사 목록
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCollect = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`${API_URL}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();

      // 요약된 기사 목록 저장
      setResults(data.results);

    } catch (err) {
      console.error("❌ 뉴스 수집 오류:", err);
      setError(`❌ 오류 발생: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>📰 SmartNews - 뉴스 자동 요약</h2>

      {/* 키워드 입력 */}
      <input
        type="text"
        placeholder="키워드 입력 (예: AI)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleCollect}>뉴스 수집 + 자동 요약</button>

      {/* 로딩 중 */}
      {loading && <p style={{ marginTop: "20px" }}>⏳ 요약 생성 중...</p>}

      {/* 오류 메시지 */}
      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>{error}</p>
      )}

      {/* 결과 렌더링 */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "700px",
          margin: "30px auto",
        }}
      >
        {results.map((item) => (
          <div
            key={item.article_id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{item.title}</h3>

            <h4>📌 간단 요약</h4>
            <p>{item.summary_short}</p>

            <h4 style={{ marginTop: "10px" }}>📝 심화 요약</h4>
            <p>{item.summary_long}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;