import type { CardId, AnalysisResult, HandResult } from "./types";
import { cardKey } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function analyzeHand(
  cards: CardId[],
): Promise<AnalysisResult[] | HandResult> {
  const cardsParam = cards.map((c) => cardKey(c)).join(",");
  const url = `${API_BASE}/api/handStats?cards=${cardsParam}&detail=all,flips`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}
