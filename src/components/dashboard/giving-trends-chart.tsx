"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyGivingData } from "@/lib/types";

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

interface TooltipEntry {
  color?: string;
  name?: string;
  value?: number | string;
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
  return (
    <div
      className="border border-border bg-card p-3 text-xs shadow-sm"
      style={{ borderRadius: "var(--radius)" }}
    >
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block w-2 h-2 shrink-0"
            style={{
              backgroundColor: entry.color as string,
              borderRadius: "1px",
            }}
          />
          <span>{entry.name}:</span>
          <span className="font-mono font-medium text-foreground">
            ${Number(entry.value).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

interface GivingTrendsChartProps {
  data: MonthlyGivingData[];
}

export function GivingTrendsChart({ data }: GivingTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="fillOneTime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillRecurring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.30} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.7}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCurrency}
          width={46}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          formatter={(value) => (
            <span style={{ color: "var(--muted-foreground)" }}>{value}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="oneTime"
          name="One-Time Gifts"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          fill="url(#fillOneTime)"
          dot={false}
          activeDot={{ r: 3, fill: "var(--chart-1)" }}
        />
        <Area
          type="monotone"
          dataKey="recurring"
          name="Recurring Gifts"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          fill="url(#fillRecurring)"
          dot={false}
          activeDot={{ r: 3, fill: "var(--chart-2)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
