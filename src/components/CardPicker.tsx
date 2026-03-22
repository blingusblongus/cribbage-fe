import type { CardId } from "../types";
import { SUITS, RANKS, SUIT_SYMBOLS, cardKey } from "../types";
import { Card } from "./Card";

interface CardPickerProps {
  selected: Set<string>;
  onToggle: (card: CardId) => void;
}

export function CardPicker({ selected, onToggle }: CardPickerProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {SUITS.map((suit) => (
        <div key={suit} className="flex items-start sm:items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-2xl w-6 sm:w-8 text-center shrink-0 text-muted-foreground pt-2 sm:pt-0">
            {SUIT_SYMBOLS[suit]}
          </span>
          <div className="flex gap-0.5 sm:gap-1 flex-wrap">
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
