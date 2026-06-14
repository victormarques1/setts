"use client";

import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";
import { deleteWorkoutAction } from "@/modules/workouts/actions/workout.actions";

type DeleteWorkoutDialogProps = {
  workoutId: string;
  workoutName: string;
  onClose: () => void;
};

export function DeleteWorkoutDialog({
  workoutId,
  workoutName,
  onClose,
}: DeleteWorkoutDialogProps) {
  return (
    <ConfirmDeleteDialog
      title="Excluir treino"
      description="Tem certeza que deseja excluir este treino?"
      entityLabel="Treino"
      entityName={workoutName}
      warning="O treino será removido da sua lista, mas os dados permanecem armazenados."
      successMessage="Treino excluído com sucesso."
      onClose={onClose}
      onConfirm={() => deleteWorkoutAction(workoutId)}
    />
  );
}
