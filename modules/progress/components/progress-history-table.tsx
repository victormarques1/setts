import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatProgressDate } from "@/modules/progress/lib/format-progress-date";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressHistoryTableProps = {
  progress: ExerciseProgressView;
};

export function ProgressHistoryTable({ progress }: ProgressHistoryTableProps) {
  if (progress.history.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{progress.exerciseName}</CardTitle>
          <CardDescription>
            Nenhuma carga registrada para este exercício ainda.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <h2 className="text-base font-semibold sm:text-lg">
        {progress.exerciseName}
      </h2>

      {/* Mobile: card list */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {progress.history.map((entry, index) => (
          <li
            key={`${entry.date}-${index}`}
            className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm"
          >
            <span className="text-muted-foreground min-w-0 truncate" title={formatProgressDate(entry.date)}>
              {formatProgressDate(entry.date)}
            </span>
            <span className="shrink-0 font-medium">{entry.weight}kg</span>
          </li>
        ))}
      </ul>

      {/* Desktop/tablet: table with horizontal scroll fallback */}
      <div className="hidden overflow-x-auto rounded-xl border border-border sm:block">
        <table className="w-full min-w-[280px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium">Data</th>
              <th className="px-4 py-3 text-right font-medium">Melhor carga</th>
            </tr>
          </thead>
          <tbody>
            {progress.history.map((entry, index) => (
              <tr
                key={`${entry.date}-${index}`}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3">{formatProgressDate(entry.date)}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {entry.weight}kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
