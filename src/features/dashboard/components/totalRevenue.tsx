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
import { toDisplayCurrency } from "@/utils/currency";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
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

export const TotalRevenue = () => {
  const now = new Date();
  const [mode, setMode] = useState<Mode>("month");
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1); // 1-12

  const queryKey = useMemo(
    () => ["revenue", { mode, year, month }],
    [mode, year, month]
  );
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("mode", mode);
      if (mode !== "all") {
        params.set("year", String(year));
      }
      if (mode === "month") params.set("month", String(month));
      const res = await fetch(`/api/revenue?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return (await res.json()) as ApiResponse;
    },
  });

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const titleText = useMemo(() => {
    if (!data) return "Total Revenue";
    if (data.mode === "month")
      return `Total Revenue · ${monthNamesShort[data.month - 1]} ${data.year}`;
    if (data.mode === "year") return `Total Revenue · ${data.year}`;
    return "Total Revenue · All Time";
  }, [data]);

  const totalDisplay = useMemo(
    () => toDisplayCurrency(data?.total ?? 0),
    [data]
  );
  const deltaPct = useMemo(() => {
    if (!data) return null;
    const prev = data.prevTotal || 0;
    if (!prev) return null;
    const pct = ((data.total - prev) / prev) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs prev`;
  }, [data]);

  const xTickFormatter = (x: number) => {
    if (!data) return String(x);
    if (data.mode === "month") return String(x); // day of month
    if (data.mode === "year") return monthNamesShort[x - 1]; // 1-12
    return String(x); // year number
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
    <Card>
      <CardHeader>
        <CardDescription>{titleText}</CardDescription>
        <CardTitle className="text-3xl">{totalDisplay}</CardTitle>
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
          <ResponsiveContainer>
            <LineChart
              data={(data?.series || []).map((p) => ({ x: p.x, revenue: p.y }))}
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
                tickFormatter={(v) => toDisplayCurrency(v).replace("$", "")}
                width={60}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent nameKey="revenue" />}
                formatter={(value) => [
                  toDisplayCurrency(Number(value)),
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{ r: 6 }}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
