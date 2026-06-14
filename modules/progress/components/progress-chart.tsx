"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatProgressDate } from "@/modules/progress/lib/format-progress-date";
import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";

type ProgressChartProps = {
  history: ExerciseProgressHistoryPoint[];
};

export function ProgressChart({ history }: ProgressChartProps) {
  if (history.length === 0) {
    return null;
  }

  const data = history.map((entry) => ({
    date: formatProgressDate(entry.date),
    weight: entry.weight,
  }));

  return (
    <div className="h-56 w-full min-w-0 rounded-xl border border-border p-3 sm:h-64 sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 4, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value) => [`${value}kg`, "Melhor carga"]}
            labelFormatter={(label) => `Data: ${label}`}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-1)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
