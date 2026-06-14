export type ExerciseLoadSummary = {
  lastLoad: { weight: number; reps: number } | null;
  trend: "up" | "down" | "same" | null;
};

type SetRecordWithSession = {
  exerciseId: string;
  weight: number;
  reps: number;
  sessionId: string;
  session: { performedAt: Date | null };
};

type SessionBest = {
  weight: number;
  reps: number;
  performedAt: Date;
};

export function buildExerciseLoadSummaries(
  records: SetRecordWithSession[],
): Map<string, ExerciseLoadSummary> {
  const exerciseSessions = new Map<string, Map<string, SessionBest>>();

  for (const record of records) {
    const performedAt = record.session.performedAt;

    if (!performedAt) {
      continue;
    }

    const sessions =
      exerciseSessions.get(record.exerciseId) ?? new Map<string, SessionBest>();
    const existing = sessions.get(record.sessionId);

    if (!existing || record.weight > existing.weight) {
      sessions.set(record.sessionId, {
        weight: record.weight,
        reps: record.reps,
        performedAt,
      });
    }

    exerciseSessions.set(record.exerciseId, sessions);
  }

  const summaries = new Map<string, ExerciseLoadSummary>();

  for (const [exerciseId, sessions] of exerciseSessions) {
    const sorted = [...sessions.values()].sort(
      (a, b) => b.performedAt.getTime() - a.performedAt.getTime(),
    );
    const latest = sorted[0] ?? null;

    let trend: ExerciseLoadSummary["trend"] = null;

    if (sorted.length >= 2) {
      const delta = sorted[0].weight - sorted[1].weight;
      trend = delta > 0 ? "up" : delta < 0 ? "down" : "same";
    }

    summaries.set(exerciseId, {
      lastLoad: latest
        ? { weight: latest.weight, reps: latest.reps }
        : null,
      trend,
    });
  }

  return summaries;
}
