import { useState } from "react";
import type { AnalysisResult, HandResult } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp, TrendingDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsProps {
  data: AnalysisResult[] | HandResult;
}

function isHandResult(data: AnalysisResult[] | HandResult): data is HandResult {
  return "mean" in data;
}

function scoreColor(score: number): string {
  if (score >= 16) return "text-amber-400";
  if (score >= 12) return "text-emerald-400";
  if (score >= 8) return "text-emerald-500/80";
  if (score >= 4) return "text-muted-foreground";
  return "text-muted-foreground/60";
}

function ScoreBreakdown({ result }: { result: HandResult }) {
  const scores = Object.entries(result.scoringOptions)
    .map(([score, info]) => ({ score: Number(score), ...info }))
    .sort((a, b) => b.score - a.score);

  const maxChance = Math.max(...scores.map((s) => s.chance));

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <Target className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean</div>
            <div className="text-lg font-bold text-foreground">{result.mean.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Max</div>
            <div className="text-lg font-bold text-foreground">{result.max}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <TrendingDown className="h-4 w-4 text-red-400" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Min</div>
            <div className="text-lg font-bold text-foreground">{result.min}</div>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="w-20">Score</TableHead>
            <TableHead>Chance</TableHead>
            <TableHead className="w-24 text-right">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map(({ score, count, chance }) => (
            <TableRow key={score} className="border-border/50">
              <TableCell className={cn("font-bold text-base", scoreColor(score))}>
                {score}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(chance / maxChance) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm tabular-nums w-14 text-right">
                    {chance.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {count} / 46
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ComboRow({
  item,
  rank,
  defaultOpen,
}: {
  item: AnalysisResult;
  rank: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          "transition-all duration-200",
          rank === 1
            ? "border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-900/10"
            : "hover:border-border/80"
        )}
      >
        <CollapsibleTrigger className="w-full text-left cursor-pointer">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                className={cn(
                  "text-xs font-bold",
                  rank === 1
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : ""
                )}
                variant={rank === 1 ? "outline" : "secondary"}
              >
                #{rank}
              </Badge>
              <span className="flex-1 text-sm">
                Keep:{" "}
                <strong className="text-foreground">
                  {item.keep.join(", ")}
                </strong>
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Discard: {item.discard.join(", ")}
              </span>
              <Badge
                variant="outline"
                className="font-mono tabular-nums border-emerald-500/30 text-emerald-400"
              >
                {item.result.mean.toFixed(2)} avg
              </Badge>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <ScoreBreakdown result={item.result} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function Results({ data }: ResultsProps) {
  if (isHandResult(data)) {
    return (
      <Card className="mt-6 border-emerald-500/20 shadow-xl shadow-emerald-900/10">
        <CardHeader>
          <CardTitle className="text-emerald-400">Hand Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreBreakdown result={data} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
        Best Hands to Keep
      </h2>
      {data.map((item, i) => (
        <ComboRow key={i} item={item} rank={i + 1} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
