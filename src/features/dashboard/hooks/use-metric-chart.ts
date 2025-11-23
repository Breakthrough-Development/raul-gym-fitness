import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Mode, QueryParams } from "../types";

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

type UseMetricChartProps = {
  queryKey: string;
  queryFn: (params: QueryParams) => Promise<ApiResponse>;
  title: string;
};

export const useMetricChart = ({
  queryKey: baseQueryKey,
  queryFn,
  title,
}: UseMetricChartProps) => {
  const now = new Date();
  const [mode, setMode] = useState<Mode>("month");
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  const queryKey = useMemo(
    () => ["metric", baseQueryKey, { mode, year, month }],
    [baseQueryKey, mode, year, month]
  );

  const { data } = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => {
      return await queryFn({ mode, year, month });
    },
  });

  const titleText = useMemo(() => {
    if (!data) return title;
    if (data.mode === "month") {
      return `${title} · ${monthNamesShort[data.month - 1]} ${data.year}`;
    }
    if (data.mode === "year") {
      return `${title} · ${data.year}`;
    }
    return `${title} · Todo el tiempo`;
  }, [data, title]);

  const deltaPct = useMemo(() => {
    if (!data) return null;
    const prev = data.prevTotal || 0;
    if (!prev) return null;
    const pct = ((data.total - prev) / prev) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs anterior`;
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

  return {
    mode,
    setMode,
    data,
    titleText,
    deltaPct,
    xTickFormatter,
    onPrev,
    onNext,
  };
};

