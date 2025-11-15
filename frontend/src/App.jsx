import { useState, useEffect } from "react";
import "./App.css";
import SentimentDonut from "./components/SentimentDonut";

function App() {
  const [keyword, setKeyword] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const extractCompany = (title) => {
    if (!title) return "";
    return title.split(",")[0].trim();
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    const res = await fetch(`${API_URL}/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });

    const data = await res.json();
    setAnalysis(data);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API_URL}/news/summary`);
    const data = await res.json();
    setHistoryList(data);
  };

  const loadHistoryDetail = async (id) => {
    const all = await fetch(`${API_URL}/news/summary`).then((r) => r.json());
    const item = all.find((x) => x.id === id);
    setSelectedHistory(item);
  };

  const getSentimentStats = (list) => {
    if (!Array.isArray(list) || list.length === 0)
      return { positive: 0, neutral: 0, negative: 0 };

    let pos = 0,
      neu = 0,
      neg = 0;

    list.forEach((a) => {
      if (a.sentiment === "긍정") pos++;
      else if (a.sentiment === "중립") neu++;
      else if (a.sentiment === "부정") neg++;
    });

    const total = list.length;

    return {
      positive: Math.round((pos / total) * 100),
      neutral: Math.round((neu / total) * 100),
      negative: Math.round((neg / total) * 100),
    };
  };

  const sentiment = getSentimentStats(analysis);
  const totalSentiment = getSentimentStats(historyList);

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h1 className="logo">SmartNews</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="키워드를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            검색
          </button>
        </div>
      </header>

      {/* ANALYSIS - 중앙 정렬 */}
      {analysis.length > 0 && (
        <div className="analysis-wrapper">
          <section className="section">
            <h2>이번 분석 결과</h2>

            <SentimentDonut
              positive={sentiment.positive}
              neutral={sentiment.neutral}
              negative={sentiment.negative}
              size={200}
            />

            <div className="card-list">
              {analysis.map((a) => (
                <div key={a.id} className="card">
                  <h4>{a.title}</h4>
                  <p>{a.summary_short}</p>
                  <span
                    className={`tag ${
                      a.sentiment === "긍정"
                        ? "positive"
                        : a.sentiment === "부정"
                        ? "negative"
                        : "neutral"
                    }`}
                  >
                    {a.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* RIGHT PANEL */}
      <div className={`fixed-right-panel ${showRight ? "open" : "closed"}`}>
        <div className="panel-header">
          <h3>과거 요약 기록</h3>

          <button
            className="toggle-btn"
            onClick={() => setShowRight(!showRight)}
          >
            {showRight ? <span>_</span> : <span>▢</span>}
          </button>
        </div>

        <div className="panel-content">
          {showRight && (
            <>
              <div className="history-list-side">
                {historyList.map((h) => (
                  <div
                    key={h.id}
                    className="history-item-side"
                    onClick={() => loadHistoryDetail(h.id)}
                  >
                    <strong>
                      {h.published_at?.slice(0, 10)} ({h.keyword})
                    </strong>
                    <span>{extractCompany(h.title)}</span>
                  </div>
                ))}
              </div>

              <div className="history-detail-side">
                {selectedHistory && (
                  <div className="detail-card">
                    <h4>
                      {selectedHistory.published_at?.slice(0, 10)} (
                      {selectedHistory.keyword}){" "}
                      {extractCompany(selectedHistory.title)}
                    </h4>

                    <p
                      className={`tag ${
                        selectedHistory.sentiment === "긍정"
                          ? "positive"
                          : selectedHistory.sentiment === "부정"
                          ? "negative"
                          : "neutral"
                      }`}
                    >
                      감정: {selectedHistory.sentiment}
                    </p>

                    <p className="summary-long">
                      {selectedHistory.summary_long}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* LEFT DONUT PANEL */}
      <div className={`fixed-bottom-left ${showLeft ? "open" : "closed"}`}>
        <div className="left-header">
          <span>전체 감정 요약</span>
          <button className="toggle-btn" onClick={() => setShowLeft(!showLeft)}>
            {showLeft ? <span>_</span> : <span>▢</span>}
          </button>
        </div>

        {showLeft && (
          <div className="left-content">
            <SentimentDonut
              positive={totalSentiment.positive}
              neutral={totalSentiment.neutral}
              negative={totalSentiment.negative}
              size={200}
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 SmartNews. All rights reserved.
      </footer>
    </div>
  );
}

export default App;