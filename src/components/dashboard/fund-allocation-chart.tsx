"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { FundBreakdownData } from "@/lib/types";

interface TooltipEntry {
  color?: string;
  name?: string;
  value?: number | string;
  payload?: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const pct = (payload[0]?.payload?.percentage as number) ?? undefined;
  return (
    <div
      className="border border-border bg-card p-3 text-xs shadow-sm"
      style={{ borderRadius: "var(--radius)" }}
    >
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      <p className="text-muted-foreground">
        Raised:{" "}
        <span className="font-mono font-medium text-foreground">
          ${Number(payload[0]?.value ?? 0).toLocaleString()}
        </span>
      </p>
      {pct !== undefined && (
        <p className="text-muted-foreground">
          Progress:{" "}
          <span className="font-mono font-medium text-foreground">{pct}%</span>
        </p>
      )}
    </div>
  );
};

// Shorten fund names for axis labels
function shortName(name: string): string {
  const map: Record<string, string> = {
    "Capital Campaign Fund": "Capital",
    "General Fund": "General",
    "Annual Fund": "Annual",
    "Scholarship Fund": "Scholar.",
    "Youth Programs Fund": "Youth",
    "Emergency Relief Fund": "Emergency",
  };
  return map[name] ?? name;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
];

interface FundAllocationChartProps {
  data: FundBreakdownData[];
}

export function FundAllocationChart({ data }: FundAllocationChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: shortName(d.fundName),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        barSize={28}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.7}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={46}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="raised" name="Amount Raised" radius={[2, 2, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
