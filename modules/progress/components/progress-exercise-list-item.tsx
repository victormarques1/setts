import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { formatWeight } from "@/lib/format-weight";
import type { UserExerciseSummary } from "@/modules/exercises/services/exercise.service";

type ProgressExerciseListItemProps = {
  exercise: UserExerciseSummary;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
};

function ProgressTrendIcon({
  trend,
}: {
  trend: UserExerciseSummary["trend"];
}) {
  if (!trend || trend === "same") {
    if (trend === "same") {
      return (
        <Minus
          className="size-4 shrink-0 text-muted-foreground"
          aria-label="Carga estável"
        />
      );
    }

    return null;
  }

  if (trend === "up") {
    return (
      <TrendingUp
        className="size-4 shrink-0 text-primary"
        aria-label="Carga em alta"
      />
    );
  }

  return (
    <TrendingDown
      className="size-4 shrink-0 text-muted-foreground"
      aria-label="Carga em queda"
    />
  );
}

export function ProgressExerciseListItem({
  exercise,
  isSelected,
  isLoading,
  onSelect,
}: ProgressExerciseListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        disabled={isLoading}
        aria-pressed={isSelected}
        aria-busy={isLoading && isSelected}
        className="group block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait"
      >
        <div
          className={
            isSelected
              ? "list-card-interactive px-4 py-4 ring-1 ring-primary/45"
              : "list-card-interactive px-4 py-4"
          }
        >
          <div className="flex min-h-11 items-center justify-between gap-4">
            <span
              className="min-w-0 flex-1 truncate text-left font-semibold tracking-tight"
              title={exercise.name}
            >
              {exercise.name}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {exercise.lastLoad ? (
                <span className="metric-value-primary text-base sm:text-lg">
                  {formatWeight(exercise.lastLoad.weight)}
                  <span className="text-sm font-semibold text-primary/80">
                    kg
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground text-sm font-medium">
                  —
                </span>
              )}
              <ProgressTrendIcon trend={exercise.trend} />
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
