import type { CardId } from "../types";
import { SUIT_SYMBOLS, RANK_DISPLAY, isRed } from "../types";
import "./Card.css";

interface CardProps {
  card: CardId;
  selected: boolean;
  onClick: (card: CardId) => void;
}

export function Card({ card, selected, onClick }: CardProps) {
  const red = isRed(card.suit);
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_DISPLAY[card.rank];

  return (
    <button
      className={`card ${red ? "card--red" : "card--black"} ${selected ? "card--selected" : ""}`}
      onClick={() => onClick(card)}
      title={`${rank}${symbol}`}
    >
      <span className="card__rank">{rank}</span>
      <span className="card__suit">{symbol}</span>
    </button>
  );
}
