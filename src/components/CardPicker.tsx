import type { CardId } from "../types";
import { SUITS, RANKS, SUIT_SYMBOLS, cardKey } from "../types";
import { Card } from "./Card";
import "./CardPicker.css";

interface CardPickerProps {
  selected: Set<string>;
  onToggle: (card: CardId) => void;
}

export function CardPicker({ selected, onToggle }: CardPickerProps) {
  return (
    <div className="card-picker">
      {SUITS.map((suit) => (
        <div key={suit} className="card-picker__row">
          <span className="card-picker__suit-label">
            {SUIT_SYMBOLS[suit]}
          </span>
          <div className="card-picker__cards">
            {RANKS.map((rank) => {
              const card: CardId = { rank, suit };
              return (
                <Card
                  key={cardKey(card)}
                  card={card}
                  selected={selected.has(cardKey(card))}
                  onClick={onToggle}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
