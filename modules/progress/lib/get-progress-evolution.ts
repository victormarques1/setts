import type { ExerciseProgressHistoryPoint } from "@/modules/progress/services/progress.service";

import { formatWeight } from "@/lib/format-weight";

export type ProgressEvolution = {
  deltaKg: number;
  formattedDeltaKg: string;
  deltaPercent: number;
  direction: "up" | "down" | "same";
};

export function getProgressEvolution(
  history: ExerciseProgressHistoryPoint[],
): ProgressEvolution | null {
  if (history.length < 2) {
    return null;
  }

  const firstWeight = history[0].weight;
  const latestWeight = history[history.length - 1].weight;
  const deltaKg = latestWeight - firstWeight;

  if (deltaKg === 0) {
    return {
      deltaKg: 0,
      formattedDeltaKg: formatWeight(0),
      deltaPercent: 0,
      direction: "same",
    };
  }

  const deltaPercent =
    firstWeight === 0 ? 0 : Math.round((deltaKg / firstWeight) * 100);

  return {
    deltaKg,
    formattedDeltaKg: formatWeight(Math.abs(deltaKg)),
    deltaPercent: Math.abs(deltaPercent),
    direction: deltaKg > 0 ? "up" : "down",
  };
}
