"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

function computeEndAngle(
  value: number,
  maxValue: number,
  startAngle: number,
  isCounterclockwise = true
): number {
  let endAngle;
  const fullTurn = isCounterclockwise ? -360 : 360;

  if (maxValue === 0 && value === 0) {
    endAngle = fullTurn + startAngle;
  } else if (maxValue === 0) {
    endAngle = fullTurn + startAngle;
  } else {
    endAngle = (value / maxValue) * fullTurn + 90;
  }

  return endAngle;
}

type BudgetChartProps = {
  label: string;
  valueInCents: number;
  maxValueInCents: number;
  showPercentage?: boolean;
  color?: string;
};

export default function RadialChart({
  label,
  valueInCents,
  maxValueInCents,
  showPercentage = false,
  color = "var(--primary)",
}: BudgetChartProps) {
  const chartData = [{ [label]: valueInCents, fill: color }];

  const chartConfig = {
    [label]: { label },
  } satisfies ChartConfig;

  // Compute angles for the radial chart
  const startAngle = 90;
  const endAngle = computeEndAngle(valueInCents, maxValueInCents, startAngle);

  // Compute chart information to display
  // Hide percentage information if division by zero
  const percentage = Math.round((valueInCents / maxValueInCents) * 100);
  if (maxValueInCents === 0) showPercentage = false;

  const maxValueString = (maxValueInCents / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

  const valueString = (valueInCents / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-62.5"
    >
      <RadialBarChart
        data={chartData}
        startAngle={startAngle}
        endAngle={endAngle}
        outerRadius={110}
        innerRadius={100}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[110, 100]}
        />

        <RadialBar dataKey={label} background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {valueString}
                    </tspan>
                    {showPercentage && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        {`${percentage}% av ${maxValueString}`}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
