import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ExerciseListItem } from "@/modules/exercises/components/exercise-list-item";
import type { ExerciseSummary } from "@/modules/exercises/services/exercise.service";

type ExerciseListProps = {
  workoutId: string;
  exercises: ExerciseSummary[];
};

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
      {exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.id}
          workoutId={workoutId}
          exercise={exercise}
        />
      ))}
    </ul>
  );
}
