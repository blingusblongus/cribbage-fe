import type { CardId } from "../types";
import { SUIT_SYMBOLS, RANK_DISPLAY, isRed } from "../types";
import { cn } from "@/lib/utils";

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
      className={cn(
        "relative flex flex-col items-center justify-center",
        "w-[38px] h-[54px] sm:w-[50px] sm:h-[70px]",
        "rounded-md sm:rounded-lg border-2 font-serif cursor-pointer select-none p-0 gap-0",
        "transition-all duration-200 ease-out",
        "bg-gradient-to-br from-white to-gray-100",
        "hover:-translate-y-1 hover:shadow-lg",
        "active:translate-y-0 active:shadow-sm",
        red ? "text-red-600" : "text-gray-900",
        selected
          ? "border-emerald-400 -translate-y-2 shadow-[0_0_12px_rgba(52,211,153,0.5),0_0_24px_rgba(52,211,153,0.2)] scale-105"
          : "border-white/20 shadow-md"
      )}
      onClick={() => onClick(card)}
      title={`${rank}${symbol}`}
    >
      <span className="absolute top-0 left-0.5 sm:top-0.5 sm:left-1 text-[8px] sm:text-[10px] font-bold leading-none">
        {rank}
      </span>
      <span className="text-lg sm:text-2xl leading-none">{symbol}</span>
      <span className="absolute bottom-0 right-0.5 sm:bottom-0.5 sm:right-1 text-[8px] sm:text-[10px] font-bold leading-none rotate-180">
        {rank}
      </span>
    </button>
  );
}
