"use client";
import { MembershipStatus } from "@prisma/client";
import { MetricChartCard } from "./metric-chart-card";

export type TotalSubscriptionsProps = {
  title: string;
  type: MembershipStatus;
};
export const TotalSubscriptions = ({
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
