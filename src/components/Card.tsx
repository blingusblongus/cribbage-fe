import type { CardId } from "../types";
import { SUIT_SYMBOLS, RANK_DISPLAY, cardSvgPath } from "../types";
import { cn } from "@/lib/utils";

interface CardProps {
  card: CardId;
  selected: boolean;
  onClick: (card: CardId) => void;
}

export function Card({ card, selected, onClick }: CardProps) {
  return (
    <button
      className={cn(
        "relative cursor-pointer select-none p-0 overflow-hidden",
        "w-[42px] h-[61px] sm:w-[50px] sm:h-[73px]",
        "rounded-sm sm:rounded-sm",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg",
        "active:translate-y-0 active:shadow-sm",
        selected
          ? "-translate-y-2 shadow-[0_0_12px_rgba(52,211,153,0.5),0_0_24px_rgba(52,211,153,0.2)] scale-105 ring-2 ring-emerald-400"
          : "shadow-md",
      )}
      onClick={() => onClick(card)}
      title={`${RANK_DISPLAY[card.rank]}${SUIT_SYMBOLS[card.suit]}`}
    >
      <img
        src={cardSvgPath(card)}
        alt={`${RANK_DISPLAY[card.rank]}${SUIT_SYMBOLS[card.suit]}`}
        className="w-full h-full"
      />
    </button>
  );
}
