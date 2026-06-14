"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FormDialog } from "@/components/dialogs/form-dialog";
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
    <FormDialog
      title="Editar exercício"
      description="Altere o nome do exercício. Mínimo de 2 caracteres."
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      error={error}
    >
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
      </div>
    </FormDialog>
  );
}
