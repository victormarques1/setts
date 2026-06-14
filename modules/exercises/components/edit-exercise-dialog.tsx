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
import { updateExerciseAction } from "@/modules/exercises/actions/exercise.actions";

type EditExerciseDialogProps = {
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
};

export function EditExerciseDialog({
  workoutId,
  exerciseId,
  exerciseName,
  onClose,
}: EditExerciseDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(exerciseName);
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
      const result = await updateExerciseAction(workoutId, exerciseId, {
        name,
      });

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
            <DialogTitle>Editar exercício</DialogTitle>
            <DialogDescription>
              Altere o nome do exercício. Mínimo de 2 caracteres.
            </DialogDescription>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`edit-exercise-name-${exerciseId}`}>Nome</Label>
              <Input
                id={`edit-exercise-name-${exerciseId}`}
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Supino Reto"
                maxLength={60}
                required
                disabled={isPending}
                aria-invalid={error ? true : undefined}
                autoFocus
              />
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
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
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
