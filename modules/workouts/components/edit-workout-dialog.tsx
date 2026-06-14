"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FormDialog } from "@/components/dialogs/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "@/modules/workouts/actions/workout.actions";

type EditWorkoutDialogProps = {
  workoutId: string;
  workoutName: string;
  onClose: () => void;
};

export function EditWorkoutDialog({
  workoutId,
  workoutName,
  onClose,
}: EditWorkoutDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(workoutName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateWorkoutAction(workoutId, { name });

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
      title="Editar treino"
      description="Altere o nome do treino. Mínimo de 3 caracteres."
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      error={error}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={`edit-workout-name-${workoutId}`}>Nome</Label>
        <Input
          id={`edit-workout-name-${workoutId}`}
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Treino A"
          maxLength={50}
          required
          disabled={isPending}
          aria-invalid={error ? true : undefined}
          autoFocus
        />
      </div>
    </FormDialog>
  );
}
