"use client";
import { getRevenue } from "@/features/dashboard/actions/get-revenue";
import { toDisplayCurrency } from "@/utils/currency";
import { MetricChartCard } from "./metric-chart-card";

export const TotalRevenueChart = () => {
  return (
    <MetricChartCard
      title="Total Revenue"
      queryKey="revenue"
      queryFn={getRevenue}
      unitLabel="Revenue"
      yFormatter={(v) => toDisplayCurrency(v)}
      chart="line"
    />
  );
};
