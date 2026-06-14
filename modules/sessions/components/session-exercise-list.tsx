import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Exercise, SetRecord } from "@/app/generated/prisma/client";

type SessionExerciseListProps = {
  workoutId: string;
  sessionId: string;
  exercises: Exercise[];
  setRecords: SetRecord[];
  isActive: boolean;
};

export function SessionExerciseList({
  workoutId,
  sessionId,
  exercises,
  setRecords,
  isActive,
}: SessionExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum exercício cadastrado</p>
          <p className="empty-state-description">
            Adicione exercícios ao treino para começar a registrar séries.
          </p>
        </div>
        {isActive ? (
          <Button
            render={
              <Link href={`/workouts/${workoutId}/exercises/new`} />
            }
            nativeButton={false}
          >
            Adicionar exercício
          </Button>
        ) : null}
      </div>
    );
  }

  const setCountByExercise = setRecords.reduce<Record<string, number>>(
    (counts, set) => {
      counts[set.exerciseId] = (counts[set.exerciseId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return (
    <ul className="flex w-full flex-col gap-2.5 px-0.5">
      {exercises.map((exercise) => {
        const setCount = setCountByExercise[exercise.id] ?? 0;
        const setLabel =
          setCount === 0
            ? isActive
              ? "Registrar"
              : "0"
            : String(setCount);

        return (
          <li key={exercise.id}>
            <Link
              href={`/workouts/${workoutId}/sessions/${sessionId}/exercises/${exercise.id}`}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="list-card-interactive px-4 py-3.5">
                <div className="flex min-h-11 items-center justify-between gap-3">
                  <span
                    className="min-w-0 truncate font-semibold tracking-tight"
                    title={exercise.name}
                  >
                    {exercise.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="metric-label">Séries</span>
                      <span
                        className={
                          setCount > 0
                            ? "metric-value-primary text-base"
                            : "text-muted-foreground text-sm font-semibold"
                        }
                      >
                        {setLabel}
                      </span>
                    </div>
                    <ChevronRight
                      className="text-muted-foreground size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
