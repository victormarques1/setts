import { formatWeight } from "@/lib/format-weight";
import { formatProgressSet } from "@/modules/progress/lib/format-progress-set";
import { getProgressEvolution } from "@/modules/progress/lib/get-progress-evolution";
import {
  getBestProgressEntry,
  getLatestProgressEntry,
} from "@/modules/progress/lib/get-progress-highlights";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressEvolutionBadgeProps = {
  history: ExerciseProgressView["history"];
};

function ProgressEvolutionBadge({ history }: ProgressEvolutionBadgeProps) {
  const evolution = getProgressEvolution(history);

  if (!evolution) {
    return null;
  }

  if (evolution.direction === "same") {
    return (
      <p className="text-muted-foreground text-sm">
        Mesma carga do primeiro registro
      </p>
    );
  }

  const arrow = evolution.direction === "up" ? "↑" : "↓";
  const sign = evolution.direction === "up" ? "+" : "-";

  return (
    <p
      className={
        evolution.direction === "up"
          ? "text-sm font-semibold text-primary"
          : "text-muted-foreground text-sm font-medium"
      }
      aria-label={`Evolução de ${evolution.formattedDeltaKg} kg desde o primeiro registro`}
    >
      {arrow} {sign}
      {evolution.formattedDeltaKg}kg desde o primeiro registro
    </p>
  );
}

type ProgressHighlightsProps = {
  progress: ExerciseProgressView;
};

function ProgressHighlights({ progress }: ProgressHighlightsProps) {
  const bestEntry = getBestProgressEntry(progress.history);
  const latestEntry = getLatestProgressEntry(progress.history);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="grid min-w-0 grid-cols-2 gap-2.5">
        <div className="stat-card min-w-0">
          {bestEntry ? (
            <>
              <p className="metric-hero-value text-primary">
                {formatWeight(bestEntry.weight)}
                <span className="metric-hero-unit text-primary/75">kg</span>
              </p>
              <p className="metric-hero-caption mt-1">Recorde pessoal</p>
              <p className="text-muted-foreground mt-1.5 truncate text-xs">
                {formatProgressSet(bestEntry)}
              </p>
            </>
          ) : (
            <>
              <p className="metric-hero-value text-muted-foreground">—</p>
              <p className="metric-hero-caption mt-1">Recorde pessoal</p>
            </>
          )}
        </div>

        <div className="list-card min-w-0 px-4 py-3.5">
          {latestEntry ? (
            <>
              <p className="metric-hero-value">
                {formatWeight(latestEntry.weight)}
                <span className="metric-hero-unit text-muted-foreground">
                  kg
                </span>
              </p>
              <p className="metric-hero-caption mt-1">Última carga</p>
              <p className="text-muted-foreground mt-1.5 truncate text-xs">
                {formatProgressSet(latestEntry)}
              </p>
            </>
          ) : (
            <>
              <p className="metric-hero-value text-muted-foreground">—</p>
              <p className="metric-hero-caption mt-1">Última carga</p>
            </>
          )}
        </div>
      </div>

      <ProgressEvolutionBadge history={progress.history} />
    </div>
  );
}

export { ProgressHighlights, ProgressEvolutionBadge };
