"use client";
import { getSubscriptions } from "@/features/dashboard/actions/get-subscriptions";
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
      queryKey="subscriptions"
      queryFn={(params) => getSubscriptions({ ...params, membership: type })}
      unitLabel="Subscriptions"
      yFormatter={(v) => String(v)}
      chart="area"
      className="pb-0"
    />
  );
};
