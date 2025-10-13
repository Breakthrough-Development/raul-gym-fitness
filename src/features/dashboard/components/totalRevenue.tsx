"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Line, LineChart } from "recharts";

export const TotalRevenue = () => {
  const data = [
    {
      revenue: 10400,
      subscription: 40,
    },
    {
      revenue: 14405,
      subscription: 90,
    },
    {
      revenue: 9400,
      subscription: 200,
    },
    {
      revenue: 8200,
      subscription: 278,
    },
    {
      revenue: 7000,
      subscription: 89,
    },
    {
      revenue: 9600,
      subscription: 239,
    },
    {
      revenue: 11244,
      subscription: 78,
    },
    {
      revenue: 26475,
      subscription: 89,
    },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--primary)",
    },
    subscription: {
      label: "Subscriptions",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-3xl">$15,231.89</CardTitle>
        <CardDescription>+20.1% from last month</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {/* TODO: move chart to their own client component: Charts requires it */}
        <ChartContainer config={chartConfig} className="h-[80px] w-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="revenue"
              stroke="var(--color-revenue)"
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
