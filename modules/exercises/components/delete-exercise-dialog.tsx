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
      const result = await deleteExerciseAction(workoutId, exerciseId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccessMessage("Exercício excluído com sucesso.");
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
            <DialogTitle>Excluir exercício</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este exercício?
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm">
              <span className="text-muted-foreground">Exercício: </span>
              <span className="font-semibold">{exerciseName}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              Os registros históricos deste exercício também serão removidos.
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
