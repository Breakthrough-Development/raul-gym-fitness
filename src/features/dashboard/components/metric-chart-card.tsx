"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

type Mode = "month" | "year" | "all";

type ApiResponse =
  | {
      mode: "month";
      year: number;
      month: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "year";
      year: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "all";
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    };

const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type MetricChartCardProps = {
  title: string;
  endpoint: string; // e.g. "/api/revenue" or "/api/subscriptions"
  unitLabel: string; // e.g. "Revenue" or "Subscriptions"
  yFormatter: (value: number) => string; // format ticks/tooltip values
  extraParams?: Record<string, string>;
  chart?: "line" | "area";
  className?: string;
};

export const MetricChartCard = ({
  title,
  endpoint,
  unitLabel,
  yFormatter,
  extraParams,
  chart = "line",
  className,
}: MetricChartCardProps) => {
  const now = new Date();
  const [mode, setMode] = useState<Mode>("month");
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  const queryKey = useMemo(
    () => ["metric", { endpoint, mode, year, month, extraParams }],
    [endpoint, mode, year, month, extraParams]
  );

  const { data } = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("mode", mode);
      if (mode !== "all") params.set("year", String(year));
      if (mode === "month") params.set("month", String(month));
      if (extraParams) {
        for (const [k, v] of Object.entries(extraParams)) params.set(k, v);
      }
      const res = await fetch(`${endpoint}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch metric");
      return (await res.json()) as ApiResponse;
    },
  });

  const chartConfig = {
    value: { label: unitLabel, color: "var(--primary)" },
  } satisfies ChartConfig;

  const titleText = useMemo(() => {
    if (!data) return title;
    if (data.mode === "month") {
      return `${title} · ${monthNamesShort[data.month - 1]} ${data.year}`;
    }
    if (data.mode === "year") {
      return `${title} · ${data.year}`;
    }
    return `${title} · All Time`;
  }, [data, title]);

  const deltaPct = useMemo(() => {
    if (!data) return null;
    const prev = data.prevTotal || 0;
    if (!prev) return null;
    const pct = ((data.total - prev) / prev) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs prev`;
  }, [data]);

  const xTickFormatter = (x: number) => {
    if (!data) return String(x);
    if (data.mode === "month") return String(x);
    if (data.mode === "year") return monthNamesShort[x - 1];
    return String(x);
  };

  const onPrev = () => {
    if (mode === "month") {
      const d = new Date(year, month - 2, 1);
      setYear(d.getFullYear());
      setMonth(d.getMonth() + 1);
    } else if (mode === "year") {
      setYear((y) => y - 1);
    }
  };
  const onNext = () => {
    if (mode === "month") {
      const d = new Date(year, month, 1);
      setYear(d.getFullYear());
      setMonth(d.getMonth() + 1);
    } else if (mode === "year") {
      setYear((y) => y + 1);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription>{titleText}</CardDescription>
        <CardTitle className="text-3xl">
          {yFormatter(data?.total ?? 0)}
        </CardTitle>
        <CardDescription>
          {deltaPct ?? (mode === "all" ? "" : "")}
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant={mode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("month")}
            >
              Month
            </Button>
            <Button
              variant={mode === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("year")}
            >
              Year
            </Button>
            <Button
              variant={mode === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("all")}
            >
              All
            </Button>
          </div>
          {mode !== "all" && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onPrev}>
                Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={onNext}>
                Next
              </Button>
            </div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          {chart === "line" ? (
            <LineChart
              data={(data?.series || []).map((p) => ({ x: p.x, value: p.y }))}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                tickFormatter={xTickFormatter}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => yFormatter(Number(v))}
                width={60}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent nameKey="value" />}
                formatter={(value) => [yFormatter(Number(value)), unitLabel]}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="value"
                stroke="var(--color-value)"
                activeDot={{ r: 6 }}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={(data?.series || []).map((p) => ({ x: p.x, value: p.y }))}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                tickFormatter={xTickFormatter}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                width={60}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent nameKey="value" />}
                formatter={(value) => [yFormatter(Number(value)), unitLabel]}
              />
              <Area
                dataKey="value"
                fill="var(--color-value)"
                fillOpacity={0.05}
                stroke="var(--color-value)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
