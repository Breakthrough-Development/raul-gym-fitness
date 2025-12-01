"use client";
import { getSubscriptions } from "@/features/dashboard/actions/get-subscriptions";
import { MembershipStatus } from "@prisma/client";
import { MetricChartCard } from "./metric-chart-card";

type TotalSubscriptionsProps = {
  title: string;
  type: MembershipStatus;
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
