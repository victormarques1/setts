"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { completeSessionAction } from "@/modules/sessions/actions/session.actions";

type CompleteSessionButtonProps = {
  workoutId: string;
  sessionId: string;
};

export function CompleteSessionButton({
  workoutId,
  sessionId,
}: CompleteSessionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    setError(null);

    startTransition(async () => {
      const result = await completeSessionAction(workoutId, sessionId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/workouts/${workoutId}`);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleComplete}
        disabled={isPending}
      >
        {isPending ? "Finalizando..." : "Finalizar treino"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
