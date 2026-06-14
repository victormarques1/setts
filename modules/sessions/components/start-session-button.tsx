"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { startSessionAction } from "@/modules/sessions/actions/session.actions";

type StartSessionButtonProps = {
  workoutId: string;
  hasActiveSession: boolean;
};

export function StartSessionButton({
  workoutId,
  hasActiveSession,
}: StartSessionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    setError(null);

    startTransition(async () => {
      const result = await startSessionAction(workoutId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/workouts/${workoutId}/sessions/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleStart} disabled={isPending}>
        {isPending
          ? "Abrindo..."
          : hasActiveSession
            ? "Continuar treino"
            : "Iniciar treino"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
