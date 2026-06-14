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
      title="Excluir exercício"
      description="Tem certeza que deseja excluir este exercício?"
      entityLabel="Exercício"
      entityName={exerciseName}
      warning="Os registros históricos deste exercício também serão removidos."
      successMessage="Exercício excluído com sucesso."
      onClose={onClose}
      onConfirm={() => deleteExerciseAction(workoutId, exerciseId)}
    />
  );
}
