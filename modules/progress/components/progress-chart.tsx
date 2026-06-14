"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  buildProgressChartData,
  formatProgressVolume,
} from "@/modules/progress/lib/build-progress-chart-data";
import { formatProgressSet } from "@/modules/progress/lib/format-progress-set";
import {
  ProgressChartModeToggle,
  type ProgressChartMode,
} from "@/modules/progress/components/progress-chart-mode-toggle";
import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";
import { cn } from "@/lib/utils";

const MIN_CHART_POINTS = 3;
const CHART_PRIMARY = "var(--primary)";
const CHART_GRID_STROKE = "oklch(1 0 0 / 6%)";
const CHART_SURFACE_CLASS = "h-44 min-h-[11rem] w-full min-w-0 sm:h-52";

type ProgressChartProps = {
  history: ExerciseProgressHistoryPoint[];
  flexible?: boolean;
};

function getChartContainerClass(flexible: boolean) {
  return cn(
    "w-full min-w-0",
    flexible ? "flex flex-col" : CHART_SURFACE_CLASS,
  );
}

function getTooltipStyle() {
  return {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    color: "var(--foreground)",
    fontSize: "0.8125rem",
    boxShadow: "0 4px 16px -4px oklch(0 0 0 / 45%)",
  };
}

function getAxisTickStyle() {
  return { fill: "var(--muted-foreground)", fontSize: 11 };
}

export function ProgressChart({ history, flexible = false }: ProgressChartProps) {
  const [mode, setMode] = useState<ProgressChartMode>("maxWeight");
  const gradientId = useId().replace(/:/g, "");

  if (history.length === 0) {
    return (
      <div
        className={cn("empty-state-card", getChartContainerClass(flexible))}
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
        className={cn("empty-state-card", getChartContainerClass(flexible))}
        aria-label="Gráfico de evolução indisponível"
      >
        <p className="empty-state-description">
          Continue registrando treinos para visualizar sua evolução.
        </p>
      </div>
    );
  }

  const data = buildProgressChartData(history);
  const tooltipStyle = getTooltipStyle();
  const axisTickStyle = getAxisTickStyle();

  return (
    <div className={cn("flex flex-col gap-3", getChartContainerClass(flexible))}>
      <ProgressChartModeToggle mode={mode} onModeChange={setMode} />

      <div className={cn("list-card p-3 sm:p-4", CHART_SURFACE_CLASS)}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {mode === "maxWeight" ? (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 4, left: 0, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={axisTickStyle}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={axisTickStyle}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value, _name, item) => {
                  const payload = item.payload as { reps: number };
                  return [
                    formatProgressSet({
                      weight: Number(value),
                      reps: payload.reps,
                    }),
                    "Carga máxima",
                  ];
                }}
                labelFormatter={(label) => `Data: ${label}`}
                contentStyle={tooltipStyle}
                cursor={{
                  stroke: CHART_GRID_STROKE,
                  strokeWidth: 1,
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={CHART_PRIMARY}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: CHART_PRIMARY,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 8, right: 4, left: 0, bottom: 4 }}
              barCategoryGap="18%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={axisTickStyle}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={axisTickStyle}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(Number(value))
                }
              />
              <Tooltip
                formatter={(value) => [
                  formatProgressVolume(Number(value)),
                  "Volume total",
                ]}
                labelFormatter={(label) => `Data: ${label}`}
                contentStyle={tooltipStyle}
                cursor={{ fill: "oklch(1 0 0 / 4%)" }}
              />
              <Bar
                dataKey="volume"
                fill={CHART_PRIMARY}
                maxBarSize={40}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
