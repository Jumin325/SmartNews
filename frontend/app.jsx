import { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");

  const handleCollect = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
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
