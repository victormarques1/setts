"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { completeSessionAction } from "@/modules/sessions/actions/session.actions";

type SessionActionBarProps = {
  workoutId: string;
  sessionId: string;
  completedExercises: number;
  totalExercises: number;
  totalSets: number;
};

export function SessionActionBar({
  workoutId,
  sessionId,
  completedExercises,
  totalExercises,
  totalSets,
}: SessionActionBarProps) {
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
    <div className="fixed-above-nav-bar">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
        <p className="text-muted-foreground text-center text-xs">
          {completedExercises}/{totalExercises} exercícios · {totalSets}{" "}
          {totalSets === 1 ? "série" : "séries"}
        </p>
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
    </div>
  );
}
