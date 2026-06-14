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
    <div className="h-64 w-full rounded-xl border border-border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip
            formatter={(value) => [`${value}kg`, "Melhor carga"]}
            labelFormatter={(label) => `Data: ${label}`}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--foreground)",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-1)", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
