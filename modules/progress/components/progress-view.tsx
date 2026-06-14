"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { UserExerciseSummary } from "@/modules/exercises/services/exercise.service";
import { getExerciseProgressAction } from "@/modules/progress/actions/progress.actions";
import { ProgressChart } from "@/modules/progress/components/progress-chart";
import { ProgressHighlights } from "@/modules/progress/components/progress-highlights";
import { ProgressHistoryTimeline } from "@/modules/progress/components/progress-history-timeline";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressViewProps = {
  exercises: UserExerciseSummary[];
  initialExerciseId?: string;
  initialProgress: ExerciseProgressView | null;
};

export function ProgressView({
  exercises,
  initialExerciseId,
  initialProgress,
}: ProgressViewProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    initialExerciseId ?? "",
  );
  const [progress, setProgress] = useState<ExerciseProgressView | null>(
    initialProgress,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectExercise = (exerciseId: string) => {
    if (!exerciseId || exerciseId === selectedExerciseId) {
      return;
    }

    setSelectedExerciseId(exerciseId);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await getExerciseProgressAction(exerciseId);

      if (!result.success) {
        setProgress(null);
        setErrorMessage(result.error);
        return;
      }

      setProgress(result.data);
    });
  };

  if (exercises.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum exercício cadastrado</p>
          <p className="empty-state-description">
            Crie treinos e exercícios para visualizar gráficos e recordes de
            carga.
          </p>
        </div>
        <Button render={<Link href="/workouts" />} nativeButton={false}>
          Ir para treinos
        </Button>
      </div>
    );
  }

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="progress-exercise">Exercício</Label>
        <select
          id="progress-exercise"
          value={selectedExerciseId}
          onChange={(event) => handleSelectExercise(event.target.value)}
          disabled={isPending}
          aria-busy={isPending}
          className="input-select"
        >
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name} — {exercise.workoutName}
            </option>
          ))}
        </select>
        {selectedExercise ? (
          <p className="text-muted-foreground text-xs">
            Treino: {selectedExercise.workoutName}
          </p>
        ) : null}
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
        <div className="flex w-full min-w-0 flex-col gap-5">
          <ProgressHighlights progress={progress} />
          <ProgressChart history={progress.history} />
          <ProgressHistoryTimeline progress={progress} />
        </div>
      ) : null}
    </div>
  );
}
