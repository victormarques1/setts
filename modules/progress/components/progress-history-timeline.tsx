import {
  formatProgressDate,
  formatProgressDateShort,
} from "@/modules/progress/lib/format-progress-date";
import { formatProgressSet } from "@/modules/progress/lib/format-progress-set";
import { getBestProgressEntry } from "@/modules/progress/lib/get-progress-highlights";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressHistoryTimelineProps = {
  progress: ExerciseProgressView;
};

export function ProgressHistoryTimeline({
  progress,
}: ProgressHistoryTimelineProps) {
  if (progress.history.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">{progress.exerciseName}</p>
          <p className="empty-state-description">
            Registre séries neste exercício para ver seu histórico de evolução e
            recordes de carga.
          </p>
        </div>
      </div>
    );
  }

  const bestEntry = getBestProgressEntry(progress.history);
  const bestWeight = bestEntry?.weight ?? 0;
  const timelineEntries = [...progress.history].reverse();

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
        Histórico
      </h2>

      <ol className="progress-timeline" aria-label="Histórico de cargas">
        {timelineEntries.map((entry, index) => {
          const isRecord = entry.weight === bestWeight;
          const isLast = index === timelineEntries.length - 1;

          return (
            <li
              key={`${entry.date}-${entry.weight}-${entry.reps}`}
              className="progress-timeline-item"
            >
              <div className="progress-timeline-marker" aria-hidden="true">
                <span
                  className={
                    isRecord
                      ? "progress-timeline-dot progress-timeline-dot-record"
                      : "progress-timeline-dot"
                  }
                >
                  {isRecord ? "🏆" : null}
                </span>
                {!isLast ? <span className="progress-timeline-line" /> : null}
              </div>

              <div className="progress-timeline-content min-w-0 flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <time
                    className="text-muted-foreground text-xs font-medium tabular-nums sm:hidden"
                    dateTime={entry.date}
                    title={formatProgressDate(entry.date)}
                  >
                    {formatProgressDateShort(entry.date)}
                  </time>
                  <time
                    className="text-muted-foreground hidden text-xs font-medium tabular-nums sm:inline"
                    dateTime={entry.date}
                  >
                    {formatProgressDate(entry.date)}
                  </time>
                  {isRecord ? <span className="badge-pr">PR</span> : null}
                </div>
                <p className="metric-value mt-1 text-lg leading-none">
                  {formatProgressSet(entry, { includeRepsLabel: false })}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
