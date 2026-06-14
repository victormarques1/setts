"use client";

import { cn } from "@/lib/utils";

export type ProgressChartMode = "maxWeight" | "totalVolume";

type ProgressChartModeToggleProps = {
  mode: ProgressChartMode;
  onModeChange: (mode: ProgressChartMode) => void;
};

const MODES: { value: ProgressChartMode; label: string }[] = [
  { value: "maxWeight", label: "Carga Máxima" },
  { value: "totalVolume", label: "Volume Total" },
];

export function ProgressChartModeToggle({
  mode,
  onModeChange,
}: ProgressChartModeToggleProps) {
  return (
    <div
      className="flex rounded-xl border border-border/60 bg-muted/50 p-1"
      role="tablist"
      aria-label="Métrica do gráfico"
    >
      {MODES.map(({ value, label }) => {
        const isActive = mode === value;

        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onModeChange(value)}
            className={cn(
              "min-h-10 flex-1 rounded-lg px-3 py-2 text-sm font-semibold tracking-tight transition-[background-color,color,box-shadow] duration-200",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "bg-surface-elevated text-foreground shadow-[0_1px_0_oklch(1_0_0/6%)_inset]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
