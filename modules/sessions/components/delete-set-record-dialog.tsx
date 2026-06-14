"use client";

import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";
import { formatWeight } from "@/lib/format-weight";
import { deleteSetRecordAction } from "@/modules/sessions/actions/session.actions";

type DeleteSetRecordDialogProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  setRecordId: string;
  setNumber: number;
  weight: number;
  reps: number;
  onClose: () => void;
};

export function DeleteSetRecordDialog({
  workoutId,
  sessionId,
  exerciseId,
  setRecordId,
  setNumber,
  weight,
  reps,
  onClose,
}: DeleteSetRecordDialogProps) {
  return (
    <ConfirmDeleteDialog
      title={`Excluir série ${setNumber}`}
      description="Tem certeza que deseja excluir esta série?"
      entityLabel="Série"
      entityName={`${formatWeight(weight)} kg × ${reps}`}
      warning="Recorde, última carga e progressão serão recalculados automaticamente."
      successMessage="Série excluída com sucesso."
      onClose={onClose}
      onConfirm={() =>
        deleteSetRecordAction(workoutId, sessionId, exerciseId, setRecordId)
      }
    />
  );
}
