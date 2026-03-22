import type { AnalysisResult, HandResult } from "../types";
import "./Results.css";

interface ResultsProps {
  data: AnalysisResult[] | HandResult;
}

function isHandResult(data: AnalysisResult[] | HandResult): data is HandResult {
  return "mean" in data;
}

function ScoreBreakdown({ result }: { result: HandResult }) {
  const scores = Object.entries(result.scoringOptions)
    .map(([score, info]) => ({ score: Number(score), ...info }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="score-breakdown">
      <div className="score-stats">
        <span>
          Mean: <strong>{result.mean.toFixed(2)}</strong>
        </span>
        <span>
          Max: <strong>{result.max}</strong>
        </span>
        <span>
          Min: <strong>{result.min}</strong>
        </span>
      </div>
      <table className="score-table">
        <thead>
          <tr>
            <th>Score</th>
            <th>Chance</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(({ score, count, chance }) => (
            <tr key={score}>
              <td>{score}</td>
              <td>{chance.toFixed(1)}%</td>
              <td>{count} / 46</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Results({ data }: ResultsProps) {
  if (isHandResult(data)) {
    return (
      <div className="results">
        <h2>Hand Analysis</h2>
        <ScoreBreakdown result={data} />
      </div>
    );
  }

  return (
    <div className="results">
      <h2>Best Hands to Keep</h2>
      {data.map((item, i) => (
        <div
          key={i}
          className={`results__combo ${i === 0 ? "results__combo--best" : ""}`}
        >
          <div className="results__combo-header">
            <span className="results__rank">#{i + 1}</span>
            <span className="results__keep">
              Keep: <strong>{item.keep.join(", ")}</strong>
            </span>
            <span className="results__discard">
              Discard: {item.discard.join(", ")}
            </span>
            <span className="results__mean">
              Avg: <strong>{item.result.mean.toFixed(2)}</strong>
            </span>
          </div>
          {i === 0 && <ScoreBreakdown result={item.result} />}
        </div>
      ))}
    </div>
  );
}
