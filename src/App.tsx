import { useState } from "react";
import type { CardId, AnalysisResult, HandResult } from "./types";
import { cardKey } from "./types";
import { analyzeHand } from "./api";
import { CardPicker } from "./components/CardPicker";
import { Results } from "./components/Results";
import "./App.css";

function App() {
  const [selected, setSelected] = useState<Map<string, CardId>>(new Map());
  const [results, setResults] = useState<
    AnalysisResult[] | HandResult | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedKeys = new Set(selected.keys());
  const count = selected.size;
  const canAnalyze = count >= 4 && count <= 6;

  function handleToggle(card: CardId) {
    const key = cardKey(card);
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else if (next.size < 6) {
        next.set(key, card);
      }
      return next;
    });
    setResults(null);
    setError(null);
  }

  function handleClear() {
    setSelected(new Map());
    setResults(null);
    setError(null);
  }

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    try {
      const cards = Array.from(selected.values());
      const data = await analyzeHand(cards);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Cribbage Hand Analyzer</h1>
        <p className="app__subtitle">
          Select 4–6 cards to analyze your hand
        </p>
      </header>

      <CardPicker selected={selectedKeys} onToggle={handleToggle} />

      <div className="app__actions">
        <span className="app__count">
          {count} card{count !== 1 ? "s" : ""} selected
          {count > 6 && " (max 6)"}
        </span>
        <button
          className="btn btn--secondary"
          onClick={handleClear}
          disabled={count === 0}
        >
          Clear
        </button>
        <button
          className="btn btn--primary"
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
        >
          {loading ? "Analyzing..." : "Analyze Hand"}
        </button>
      </div>

      {error && <div className="app__error">{error}</div>}
      {results && <Results data={results} />}
    </div>
  );
}

export default App;
