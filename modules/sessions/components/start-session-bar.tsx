"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { startSessionAction } from "@/modules/sessions/actions/session.actions";

type StartSessionBarProps = {
  workoutId: string;
};

export function StartSessionBar({ workoutId }: StartSessionBarProps) {
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
    <div className="fixed-above-nav-bar sm:hidden">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={isPending}
          aria-busy={isPending}
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          {isPending ? "Abrindo..." : "Iniciar treino"}
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
