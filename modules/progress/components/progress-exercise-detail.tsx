"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressChart } from "@/modules/progress/components/progress-chart";
import { ProgressHighlights } from "@/modules/progress/components/progress-highlights";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressExerciseDetailProps = {
  exerciseName: string;
  workoutName: string;
  progress: ExerciseProgressView | null;
  isPending: boolean;
  errorMessage: string | null;
  onBack: () => void;
};

export function ProgressExerciseDetail({
  exerciseName,
  workoutName,
  progress,
  isPending,
  errorMessage,
  onBack,
}: ProgressExerciseDetailProps) {
  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-5">
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="ghost"
          className="back-link w-fit"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Button>

        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight wrap-break-word">
            {exerciseName}
          </h1>
          <p className="text-muted-foreground text-sm">{workoutName}</p>
        </div>
      </div>

      {errorMessage ? (
        <div
          className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      {isPending ? (
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Carregando progressão...
        </p>
      ) : null}

      {progress ? (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-5">
          <ProgressHighlights progress={progress} />
          <ProgressChart history={progress.history} flexible />
        </div>
      ) : null}
    </div>
  );
}
