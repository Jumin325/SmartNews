import { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");

  const handleCollect = async () => {
    // 환경변수에서 API URL 가져오기
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>📰 SmartNews - 뉴스 수집 테스트</h2>
      <input
        type="text"
        placeholder="키워드 입력 (예: AI)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleCollect}>뉴스 수집 실행</button>

      <pre style={{ marginTop: "20px", textAlign: "left", width: "80%", margin: "auto" }}>
        {result}
      </pre>
    </div>
  );
}

export default App;