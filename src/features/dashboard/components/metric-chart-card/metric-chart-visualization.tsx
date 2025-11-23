import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ApiResponse } from "../../types";

type MetricChartVisualizationProps = {
  chart: "line" | "area";
  data: ApiResponse | undefined;
  unitLabel: string;
  yFormatter: (value: number) => string;
  xTickFormatter: (value: number) => string;
};

export const MetricChartVisualization = ({
  chart,
  data,
  unitLabel,
  yFormatter,
  xTickFormatter,
}: MetricChartVisualizationProps) => {
  const chartConfig = {
    value: { label: unitLabel, color: "var(--primary)" },
  } satisfies ChartConfig;

  const chartData = (data?.series || []).map((p) => ({ x: p.x, value: p.y }));

  const lineChart = (
    <LineChart
      data={chartData}
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
        tickFormatter={(v) => yFormatter(Number(v))}
        width={60}
        tickLine={false}
        axisLine={false}
      />
      <ChartTooltip
        content={<ChartTooltipContent nameKey="value" />}
        formatter={(value) => [yFormatter(Number(value)), unitLabel]}
      />
      <Line
        type="monotone"
        strokeWidth={2}
        dataKey="value"
        stroke="var(--color-value)"
        activeDot={{ r: 6 }}
        dot={false}
      />
    </LineChart>
  );

  const areaChart = (
    <AreaChart
      data={chartData}
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
        width={60}
        tickLine={false}
        axisLine={false}
        allowDecimals={false}
      />
      <ChartTooltip
        content={<ChartTooltipContent nameKey="value" />}
        formatter={(value) => [yFormatter(Number(value)), unitLabel]}
      />
      <Area
        dataKey="value"
        fill="var(--color-value)"
        fillOpacity={0.05}
        stroke="var(--color-value)"
        strokeWidth={2}
        type="monotone"
      />
    </AreaChart>
  );

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      {chart === "line" ? lineChart : areaChart}
    </ChartContainer>
  );
};
