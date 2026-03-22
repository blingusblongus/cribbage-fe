import { useState } from "react";
import type { CardId, AnalysisResult, HandResult } from "./types";
import { cardKey } from "./types";
import { analyzeHand } from "./api";
import { CardPicker } from "./components/CardPicker";
import { Results } from "./components/Results";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen">
      <div className="max-w-[880px] mx-auto px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Cribbage Hand Analyzer
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Select 4-6 cards to analyze your hand
          </p>
        </header>

        <div className="bg-card/50 backdrop-blur rounded-2xl border border-border p-6 shadow-xl">
          <CardPicker selected={selectedKeys} onToggle={handleToggle} />

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">
                {count} card{count !== 1 ? "s" : ""} selected
              </span>
              {count > 0 && count < 4 && (
                <span className="text-xs text-muted-foreground/60 ml-2">
                  (need {4 - count} more)
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={count === 0}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Hand"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}
        {results && <Results data={results} />}
      </div>
    </div>
  );
}

export default App;
