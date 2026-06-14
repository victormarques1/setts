import { formatProgressDate } from "@/modules/progress/lib/format-progress-date";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressHistoryTableProps = {
  progress: ExerciseProgressView;
};

export function ProgressHistoryTable({ progress }: ProgressHistoryTableProps) {
  if (progress.history.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">{progress.exerciseName}</p>
          <p className="empty-state-description">
            Registre séries neste exercício para ver seu gráfico de evolução e
            recordes de carga.
          </p>
        </div>
      </div>
    );
  }

  const bestWeight = Math.max(...progress.history.map((entry) => entry.weight));

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <h2 className="text-base font-bold tracking-tight">
        {progress.exerciseName}
      </h2>

      <ul className="flex flex-col gap-2 sm:hidden">
        {progress.history.map((entry, index) => {
          const isRecord = entry.weight === bestWeight;

          return (
            <li
              key={`${entry.date}-${index}`}
              className="list-card flex min-h-11 items-center justify-between gap-3 px-4 py-3"
            >
              <span
                className="text-muted-foreground min-w-0 truncate text-sm"
                title={formatProgressDate(entry.date)}
              >
                {formatProgressDate(entry.date)}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                {isRecord ? (
                  <span className="badge-pr">PR</span>
                ) : null}
                <span className="metric-value-primary text-base">
                  {entry.weight}
                  <span className="text-sm font-semibold text-primary/80">
                    {" "}
                    kg
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-border/70 sm:block">
        <table className="w-full min-w-[280px] text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-surface/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Melhor carga
              </th>
            </tr>
          </thead>
          <tbody>
            {progress.history.map((entry, index) => {
              const isRecord = entry.weight === bestWeight;

              return (
                <tr
                  key={`${entry.date}-${index}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatProgressDate(entry.date)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center justify-end gap-2">
                      {isRecord ? (
                        <span className="badge-pr">PR</span>
                      ) : null}
                      <span className="font-bold tabular-nums text-primary">
                        {entry.weight} kg
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
