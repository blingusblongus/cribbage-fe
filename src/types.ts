export type Suit = "s" | "h" | "c" | "d";
export type Rank =
  | "a"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "j"
  | "q"
  | "k";

export interface CardId {
  rank: Rank;
  suit: Suit;
}

export const SUITS: Suit[] = ["s", "h", "c", "d"];
export const RANKS: Rank[] = [
  "a",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k",
];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  s: "\u2660",
  h: "\u2665",
  c: "\u2663",
  d: "\u2666",
};

export const SUIT_NAMES: Record<Suit, string> = {
  s: "Spades",
  h: "Hearts",
  c: "Clubs",
  d: "Diamonds",
};

export const RANK_DISPLAY: Record<Rank, string> = {
  a: "A",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  j: "J",
  q: "Q",
  k: "K",
};

export function cardKey(card: CardId): string {
  return `${card.rank}${card.suit}`;
}

export function isRed(suit: Suit): boolean {
  return suit === "h" || suit === "d";
}

const SVG_SUIT: Record<Suit, string> = {
  s: "spades", h: "hearts", c: "clubs", d: "diamonds",
};

const SVG_RANK: Record<Rank, string> = {
  a: "ace", "2": "2", "3": "3", "4": "4", "5": "5",
  "6": "6", "7": "7", "8": "8", "9": "9", "10": "10",
  j: "jack", q: "queen", k: "king",
};

export function cardSvgPath(card: CardId): string {
  return `/cards/${SVG_RANK[card.rank]}_of_${SVG_SUIT[card.suit]}.svg`;
}

export interface ScoringOption {
  count: number;
  chance: number;
  flips?: string[];
}

export interface HandResult {
  mean: number;
  max: number;
  min: number;
  standardDeviation: number;
  scoringOptions: Record<string, ScoringOption>;
}

export interface AnalysisResult {
  keep: string[];
  discard: string[];
  result: HandResult;
}
