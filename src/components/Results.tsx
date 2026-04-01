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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

function computeMedian(result: HandResult): number {
  const entries = Object.entries(result.scoringOptions)
    .map(([score, info]) => ({ score: Number(score), count: info.count }))
    .sort((a, b) => a.score - b.score);
  const total = entries.reduce((sum, e) => sum + e.count, 0);
  const mid = total / 2;
  let cumulative = 0;
  for (const e of entries) {
    cumulative += e.count;
    if (cumulative >= mid) return e.score;
  }
  return entries[entries.length - 1].score;
}

function getChartData(result: HandResult) {
  const raw = Object.entries(result.scoringOptions)
    .map(([score, info]) => ({ score: Number(score), ...info }));
  const min = result.min;
  const max = result.max;
  const byScore = new Map(raw.map((d) => [d.score, d]));
  const filled = [];
  for (let s = min; s <= max; s++) {
    filled.push(byScore.get(s) ?? { score: s, chance: 0, count: 0 });
  }
  return filled;
}

function scoreColor29(score: number): string {
  // 0=gray, 8=green, 16=yellow, 20+=red
  if (score <= 8) {
    return lerpColor([107, 114, 128], [52, 211, 153], score / 8);
  } else if (score <= 16) {
    return lerpColor([52, 211, 153], [251, 191, 36], (score - 8) / 8);
  } else {
    return lerpColor([251, 191, 36], [239, 68, 68], Math.min((score - 16) / 4, 1));
  }
}

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function Sparkline({ result }: { result: HandResult }) {
  const data = getChartData(result);
  const maxChance = Math.max(...data.map((d) => d.chance));

  return (
    <div className="flex items-end gap-px h-[18px] sm:h-[22px]" title={`Mean: ${result.mean.toFixed(2)}`}>
      {data.map((d) => (
        <div
          key={d.score}
          className="w-[3px] sm:w-[4px] rounded-t-sm min-h-[1px]"
          style={{
            height: `${(d.chance / maxChance) * 100}%`,
            backgroundColor: scoreColor29(d.score),
          }}
        />
      ))}
    </div>
  );
}

function ScoreDistributionChart({ result }: { result: HandResult }) {
  const data = getChartData(result);
  const median = computeMedian(result);

  return (
    <div className="pt-3 sm:pt-4 border-t border-border">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="chanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="score"
            tick={{ fontSize: 11, fill: "#8e8e82" }}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={[result.min, result.max]}
            ticks={data.map((d) => d.score)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8e8e82" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            itemStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Chance"]}
            labelFormatter={(label) => `Score: ${label}`}
            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
          />
          <ReferenceLine
            x={result.mean}
            stroke="#34d399"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `avg ${result.mean.toFixed(1)}`,
              position: "top",
              fontSize: 10,
              fill: "#34d399",
            }}
          />
          <ReferenceLine
            x={median}
            stroke="#fbbf24"
            strokeDasharray="2 3"
            strokeWidth={1.5}
            label={{
              value: `med ${median}`,
              position: "insideBottomLeft",
              fontSize: 10,
              fill: "#fbbf24",
            }}
          />
          <Area
            type="monotone"
            dataKey="chance"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#chanceGradient)"
            dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#34d399", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScoreBreakdown({ result }: { result: HandResult }) {
  const scores = getChartData(result).sort((a, b) => b.score - a.score);
  const maxChance = Math.max(...scores.map((s) => s.chance));
  const median = computeMedian(result);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Mean</div>
            <div className="text-base sm:text-lg font-bold text-foreground">{result.mean.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Median</div>
            <div className="text-base sm:text-lg font-bold text-foreground">{median}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Max</div>
            <div className="text-base sm:text-lg font-bold text-foreground">{result.max}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">Min</div>
            <div className="text-base sm:text-lg font-bold text-foreground">{result.min}</div>
          </div>
        </div>
      </div>
      <ScoreDistributionChart result={result} />
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="w-14 sm:w-20 text-xs sm:text-sm">Score</TableHead>
            <TableHead className="text-xs sm:text-sm">Chance</TableHead>
            <TableHead className="w-16 sm:w-24 text-right text-xs sm:text-sm">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map(({ score, count, chance }) => (
            <TableRow key={score} className="border-border/50">
              <TableCell className={cn("font-bold text-sm sm:text-base", scoreColor(score))}>
                {score}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(chance / maxChance) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm tabular-nums w-12 sm:w-14 text-right">
                    {chance.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums text-xs sm:text-sm">
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
          <CardHeader className="py-2.5 sm:py-3 px-3 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Badge
                className={cn(
                  "text-[10px] sm:text-xs font-bold",
                  rank === 1
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : ""
                )}
                variant={rank === 1 ? "outline" : "secondary"}
              >
                #{rank}
              </Badge>
              <span className="flex-1 text-xs sm:text-sm min-w-0">
                Keep:{" "}
                <strong className="text-foreground">
                  {item.keep.join(", ")}
                </strong>
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                Discard: {item.discard.join(", ")}
              </span>
              <Sparkline result={item.result} />
              <Badge
                variant="outline"
                className="font-mono tabular-nums border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs"
              >
                {item.result.mean.toFixed(2)}{" "}
                <span className="text-muted-foreground">
                  ±{item.result.standardDeviation.toFixed(1)}
                </span>
              </Badge>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  open && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
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
      <Card className="mt-4 sm:mt-6 border-emerald-500/20 shadow-xl shadow-emerald-900/10">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-emerald-400 text-base sm:text-lg">Hand Analysis</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ScoreBreakdown result={data} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
      <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
        Best Hands to Keep
      </h2>
      {data.map((item, i) => (
        <ComboRow key={i} item={item} rank={i + 1} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
