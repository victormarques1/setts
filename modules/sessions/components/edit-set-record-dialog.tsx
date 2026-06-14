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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatWeight } from "@/lib/format-weight";
import { updateSetRecordAction } from "@/modules/sessions/actions/session.actions";

type EditSetRecordDialogProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  setRecordId: string;
  setNumber: number;
  initialWeight: number;
  initialReps: number;
  onClose: () => void;
  onRequestDelete: () => void;
};

export function EditSetRecordDialog({
  workoutId,
  sessionId,
  exerciseId,
  setRecordId,
  setNumber,
  initialWeight,
  initialReps,
  onClose,
  onRequestDelete,
}: EditSetRecordDialogProps) {
  const router = useRouter();
  const [weight, setWeight] = useState(formatWeight(initialWeight));
  const [reps, setReps] = useState(String(initialReps));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateSetRecordAction(
        workoutId,
        sessionId,
        exerciseId,
        setRecordId,
        { weight, reps },
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      onClose();
      router.refresh();
    });
  }

  return (
    <DialogRoot open onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Editar série {setNumber}</DialogTitle>
            <DialogDescription>
              Corrija o peso e as repetições registrados nesta série.
            </DialogDescription>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`edit-set-weight-${setRecordId}`}>Peso</Label>
                <Input
                  id={`edit-set-weight-${setRecordId}`}
                  name="weight"
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="0"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  required
                  disabled={isPending}
                  aria-invalid={error ? true : undefined}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`edit-set-reps-${setRecordId}`}>
                  Repetições
                </Label>
                <Input
                  id={`edit-set-reps-${setRecordId}`}
                  name="reps"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="1"
                  value={reps}
                  onChange={(event) => setReps(event.target.value)}
                  required
                  disabled={isPending}
                  aria-invalid={error ? true : undefined}
                />
              </div>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      disabled={isPending}
                    />
                  }
                >
                  Cancelar
                </DialogClose>
                <Button
                  className="w-full sm:w-auto"
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={isPending}
                onClick={onRequestDelete}
              >
                Excluir
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
