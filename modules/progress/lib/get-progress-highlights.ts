import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";

export function getBestProgressEntry(
  history: ExerciseProgressHistoryPoint[],
): ExerciseProgressHistoryPoint | null {
  if (history.length === 0) {
    return null;
  }

  return history.reduce((best, entry) =>
    entry.weight > best.weight ? entry : best,
  );
}

export function getLatestProgressEntry(
  history: ExerciseProgressHistoryPoint[],
): ExerciseProgressHistoryPoint | null {
  if (history.length === 0) {
    return null;
  }

  return history[history.length - 1];
}
