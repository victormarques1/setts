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
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2.5">
        <div className="flex items-center justify-center gap-4 text-xs font-semibold" aria-live="polite">
          <span className="text-muted-foreground">
            <span className="text-foreground">{completedExercises}</span>/
            {totalExercises} exercícios
          </span>
          <span className="text-border">·</span>
          <span className="text-primary tabular-nums">
            {totalSets} {totalSets === 1 ? "série" : "séries"}
          </span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handleComplete}
          disabled={isPending}
          aria-busy={isPending}
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
