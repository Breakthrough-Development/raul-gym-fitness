"use client";
import { toDisplayCurrency } from "@/utils/currency";
import { MetricChartCard } from "./metric-chart-card";

export const TotalRevenueChart = () => {
  return (
    <MetricChartCard
      title="Total Revenue"
      endpoint="/api/revenue"
      unitLabel="Revenue"
      yFormatter={(v) => toDisplayCurrency(v)}
      chart="line"
    />
  );
};
