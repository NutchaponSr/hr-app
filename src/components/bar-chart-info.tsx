import { 
  Bar,
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis
} from "recharts";

import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface Props<T extends object> {
  data: T[];
  dataKey: Array<keyof T>;
  chartConfig: ChartConfig;
}

export const BarChartInfo = <T extends object>({ chartConfig, data, dataKey }: Props<T>) => {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis 
          dataKey={dataKey[0] as string}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip 
          cursor={false}
          content={<ChartTooltipContent indicator="dot" className="w-40" />}
        />
        {dataKey.slice(1).map((key, index) => (
          <Bar
            key={index}
            dataKey={key as string}
            fill={`var(--chart-${index + 1})`}
            label={{ value: key as string, fill: "var(--primary)", position: "top" }}
            radius={4}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}