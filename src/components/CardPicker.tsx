import type { CardId } from "../types";
import { SUITS, RANKS, SUIT_SYMBOLS, cardKey } from "../types";
import { Card } from "./Card";

interface CardPickerProps {
  selected: Set<string>;
  onToggle: (card: CardId) => void;
}

export function CardPicker({ selected, onToggle }: CardPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {SUITS.map((suit) => (
        <div key={suit} className="flex items-center gap-2">
          <span className="text-2xl w-8 text-center shrink-0 text-muted-foreground">
            {SUIT_SYMBOLS[suit]}
          </span>
          <div className="flex gap-1 flex-wrap">
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
