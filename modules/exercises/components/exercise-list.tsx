import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatWeight } from "@/lib/format-weight";
import type { ExerciseSummary } from "@/modules/exercises/services/exercise.service";

type ExerciseListProps = {
  workoutId: string;
  exercises: ExerciseSummary[];
};

function formatLastLoad(lastLoad: ExerciseSummary["lastLoad"]) {
  if (!lastLoad) {
    return null;
  }

  return {
    weight: formatWeight(lastLoad.weight),
    reps: lastLoad.reps,
  };
}

export function ExerciseList({ workoutId, exercises }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum exercício cadastrado</p>
          <p className="empty-state-description">
            Adicione exercícios a este treino para registrar séries e acompanhar
            sua progressão de carga.
          </p>
        </div>
        <Button
          render={<Link href={`/workouts/${workoutId}/exercises/new`} />}
          nativeButton={false}
        >
          Criar exercício
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2.5">
      {exercises.map((exercise) => {
        const lastLoad = formatLastLoad(exercise.lastLoad);

        return (
          <li key={exercise.id}>
            <div className="list-card px-4 py-3.5">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <span
                  className="min-w-0 truncate font-semibold tracking-tight"
                  title={exercise.name}
                >
                  {exercise.name}
                </span>
                {lastLoad ? (
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="metric-label">Última carga</span>
                    <span className="metric-value-primary">
                      {lastLoad.weight}
                      <span className="text-sm font-semibold text-primary/80">
                        {" "}
                        kg
                      </span>
                      <span className="text-muted-foreground text-sm font-medium">
                        {" "}
                        × {lastLoad.reps}
                      </span>
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground shrink-0 text-xs font-medium">
                    Sem registro
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
