"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { startSessionAction } from "@/modules/sessions/actions/session.actions";

type StartSessionFabProps = {
  workoutId: string;
  hasActiveSession: boolean;
};

export function StartSessionFab({
  workoutId,
  hasActiveSession,
}: StartSessionFabProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const label = hasActiveSession ? "Continuar treino" : "Iniciar treino";

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
    <>
      <Button
        type="button"
        className="fixed-above-nav-fab md:hidden"
        onClick={handleStart}
        disabled={isPending}
        aria-label={isPending ? "Abrindo treino..." : label}
      >
        <Play className="size-5" aria-hidden="true" />
      </Button>
      {error ? (
        <p
          className="fixed-above-nav-error text-sm text-destructive md:hidden"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
