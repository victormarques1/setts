"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  function handleDelete() {
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await deleteSetRecordAction(
        workoutId,
        sessionId,
        exerciseId,
        setRecordId,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccessMessage("Série excluída com sucesso.");
      router.refresh();

      window.setTimeout(() => {
        onClose();
      }, 1200);
    });
  }

  return (
    <DialogRoot open onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Excluir série {setNumber}</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta série?
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm">
              <span className="text-muted-foreground">Série: </span>
              <span className="font-semibold">
                {formatWeight(weight)} kg × {reps}
              </span>
            </p>
            <p className="text-muted-foreground text-sm">
              Recorde, última carga e progressão serão recalculados
              automaticamente.
            </p>

            <div
              aria-live="polite"
              className={!error && !successMessage ? "sr-only" : "min-h-5"}
            >
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              {successMessage ? (
                <p className="text-sm font-medium text-primary" role="status">
                  {successMessage}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isPending || successMessage !== null}
                  />
                }
              >
                Cancelar
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isPending || successMessage !== null}
                aria-busy={isPending}
                onClick={handleDelete}
              >
                {isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
