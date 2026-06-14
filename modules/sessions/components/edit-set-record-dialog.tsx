"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FormDialog } from "@/components/dialogs/form-dialog";
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
}: EditSetRecordDialogProps) {
  const router = useRouter();
  const [weight, setWeight] = useState(formatWeight(initialWeight));
  const [reps, setReps] = useState(String(initialReps));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    <FormDialog
      title={`Editar série ${setNumber}`}
      description="Corrija o peso e as repetições registrados nesta série."
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      error={error}
    >
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
          <Label htmlFor={`edit-set-reps-${setRecordId}`}>Repetições</Label>
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
    </FormDialog>
  );
}
