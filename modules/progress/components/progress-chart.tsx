"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatProgressDate } from "@/modules/progress/lib/format-progress-date";
import { formatProgressSet } from "@/modules/progress/lib/format-progress-set";
import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";

const MIN_CHART_POINTS = 3;

type ProgressChartProps = {
  history: ExerciseProgressHistoryPoint[];
};

export function ProgressChart({ history }: ProgressChartProps) {
  if (history.length === 0) {
    return (
      <div
        className="empty-state-card h-44 w-full min-w-0 sm:h-52"
        aria-label="Gráfico de evolução sem dados"
      >
        <p className="empty-state-description">
          O gráfico aparecerá aqui após registrar séries neste exercício.
        </p>
      </div>
    );
  }

  if (history.length < MIN_CHART_POINTS) {
    return (
      <div
        className="empty-state-card h-44 w-full min-w-0 sm:h-52"
        aria-label="Gráfico de evolução indisponível"
      >
        <p className="empty-state-description">
          Continue registrando treinos para visualizar sua evolução.
        </p>
      </div>
    );
  }

  const data = history.map((entry) => ({
    date: formatProgressDate(entry.date),
    weight: entry.weight,
    reps: entry.reps,
  }));

  return (
    <div className="list-card h-44 w-full min-w-0 p-3 sm:h-52 sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value, _name, item) => {
              const payload = item.payload as { reps: number };
              return [
                formatProgressSet({ weight: Number(value), reps: payload.reps }),
                "Melhor carga",
              ];
            }}
            labelFormatter={(label) => `Data: ${label}`}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              color: "var(--foreground)",
              fontSize: "0.8125rem",
              boxShadow: "0 4px 16px -4px oklch(0 0 0 / 45%)",
            }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#weightGradient)"
            dot={{ fill: "var(--chart-1)", r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "var(--chart-1)",
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
