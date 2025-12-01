"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMetricChart } from "../../hooks/use-metric-chart";
import { ApiResponse, QueryParams } from "../../types";
import { MetricChartControls } from "./metric-chart-controls";
import { MetricChartVisualization } from "./metric-chart-visualization";

type MetricChartCardProps = {
  title: string;
  queryKey: string;
  queryFn: (params: QueryParams) => Promise<ApiResponse>;
  unitLabel: string; // e.g. "Revenue" or "Subscriptions"
  yFormatter: (value: number) => string; // format ticks/tooltip values
  chart?: "line" | "area";
  className?: string;
};

export const MetricChartCard = ({
  title,
  queryKey,
  queryFn,
  unitLabel,
  yFormatter,
  chart = "line",
  className,
}: MetricChartCardProps) => {
  const {
    mode,
    setMode,
    data,
    titleText,
    deltaPct,
    xTickFormatter,
    onPrev,
    onNext,
  } = useMetricChart({ queryKey, queryFn, title });

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
          <MetricChartControls
            mode={mode}
            setMode={setMode}
            onPrev={onPrev}
            onNext={onNext}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <MetricChartVisualization
          chart={chart}
          data={data}
          unitLabel={unitLabel}
          yFormatter={yFormatter}
          xTickFormatter={xTickFormatter}
        />
      </CardContent>
    </Card>
  );
};

