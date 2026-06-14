"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { startSessionAction } from "@/modules/sessions/actions/session.actions";

type StartSessionFabProps = {
  workoutId: string;
};

export function StartSessionFab({ workoutId }: StartSessionFabProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const label = "Iniciar treino";

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
        className={cn(
          "fixed-above-nav-fab",
          isPending && "pointer-events-none opacity-70",
        )}
        size="icon-lg"
        onClick={handleStart}
        disabled={isPending}
        aria-label={isPending ? "Abrindo treino..." : label}
        aria-busy={isPending}
      >
        <Play className="size-6 fill-current" aria-hidden="true" />
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
