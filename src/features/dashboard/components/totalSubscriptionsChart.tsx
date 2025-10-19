"use client";
import { EstadoMembresia } from "@prisma/client";
import { MetricChartCard } from "./metric-chart-card";

export type TotalSubscriptionsProps = {
  title: string;
  type: EstadoMembresia;
};
export const TotalSubscriptionsChart = ({
  title,
  type,
}: TotalSubscriptionsProps) => {
  return (
    <MetricChartCard
      title={title}
      endpoint="/api/subscriptions"
      unitLabel="Subscriptions"
      yFormatter={(v) => String(v)}
      chart="area"
      className="pb-0"
      extraParams={{ membership: type }}
    />
  );
};
