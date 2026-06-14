import type { UserExerciseSummary } from "@/modules/exercises/services/exercise.service";
import { ProgressExerciseListItem } from "@/modules/progress/components/progress-exercise-list-item";

type ProgressExerciseListProps = {
  exercises: UserExerciseSummary[];
  selectedExerciseId: string;
  loadingExerciseId: string | null;
  onSelectExercise: (exerciseId: string) => void;
};

export function ProgressExerciseList({
  exercises,
  selectedExerciseId,
  loadingExerciseId,
  onSelectExercise,
}: ProgressExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum exercício encontrado</p>
          <p className="empty-state-description">
            Ajuste a busca ou o filtro de treino para ver outros exercícios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {exercises.map((exercise) => (
        <ProgressExerciseListItem
          key={exercise.id}
          exercise={exercise}
          isSelected={exercise.id === selectedExerciseId}
          isLoading={exercise.id === loadingExerciseId}
          onSelect={() => onSelectExercise(exercise.id)}
        />
      ))}
    </ul>
  );
}
