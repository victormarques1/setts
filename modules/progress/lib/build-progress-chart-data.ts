import { formatProgressDateShort } from "@/modules/progress/lib/format-progress-date";
import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";

export type ProgressChartDataPoint = {
  dateKey: string;
  dateLabel: string;
  weight: number;
  reps: number;
  volume: number;
};

function formatChartDateLabel(date: string): string {
  const shortLabel = formatProgressDateShort(date);

  return shortLabel.replace(
    /\s([a-zà-ú]+)$/i,
    (_, month: string) => ` ${month.charAt(0).toUpperCase()}${month.slice(1)}`,
  );
}

export function buildProgressChartData(
  history: ExerciseProgressHistoryPoint[],
): ProgressChartDataPoint[] {
  return history.map((entry) => ({
    dateKey: entry.date,
    dateLabel: formatChartDateLabel(entry.date),
    weight: entry.weight,
    reps: entry.reps,
    volume: entry.volume,
  }));
}

export function formatProgressVolume(volume: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(volume)} kg`;
}
