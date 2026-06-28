"use client";

import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";
import { deleteExerciseAction } from "@/modules/exercises/actions/exercise.actions";

type DeleteExerciseDialogProps = {
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
};

export function DeleteExerciseDialog({
  workoutId,
  exerciseId,
  exerciseName,
  onClose,
}: DeleteExerciseDialogProps) {
  return (
    <ConfirmDeleteDialog
      title="Remover exercício"
      description="Tem certeza que deseja remover este exercício do treino?"
      entityLabel="Exercício"
      entityName={exerciseName}
      warning="Os registros históricos deste exercício neste treino também serão removidos."
      successMessage="Exercício removido do treino."
      onClose={onClose}
      onConfirm={() => deleteExerciseAction(workoutId, exerciseId)}
    />
  );
}
