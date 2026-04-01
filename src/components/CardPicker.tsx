import type { CardId } from "../types";
import { SUITS, RANKS, SUIT_SYMBOLS, cardKey } from "../types";
import { Card } from "./Card";

interface CardPickerProps {
  selected: Set<string>;
  onToggle: (card: CardId) => void;
}

export function CardPicker({ selected, onToggle }: CardPickerProps) {
  // 12 narrow columns + 1 full-width column for the last card
  // Cards overflow their cell to the right, creating natural overlap
  // that adjusts automatically based on container width
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {SUITS.map((suit) => (
        <div key={suit} className="flex items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-2xl w-6 sm:w-8 text-center shrink-0 text-muted-foreground">
            {SUIT_SYMBOLS[suit]}
          </span>
          <div
            className="flex-1 min-w-0"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr)) auto",
            }}
          >
            {RANKS.map((rank) => {
              const card: CardId = { rank, suit };
              return (
                <div key={cardKey(card)} className="overflow-visible">
                  <Card
                    card={card}
                    selected={selected.has(cardKey(card))}
                    onClick={onToggle}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
