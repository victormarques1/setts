"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { UserExerciseSummary } from "@/modules/exercises/services/exercise.service";
import { getExerciseProgressAction } from "@/modules/progress/actions/progress.actions";
import { ProgressChart } from "@/modules/progress/components/progress-chart";
import { ProgressHistoryTable } from "@/modules/progress/components/progress-history-table";
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhum exercício cadastrado</CardTitle>
          <CardDescription>
            Crie treinos e exercícios para acompanhar sua progressão de carga.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/workouts" />} nativeButton={false}>
            Ir para treinos
          </Button>
        </CardContent>
      </Card>
    );
  }

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="progress-exercise">Exercício</Label>
        <select
          id="progress-exercise"
          value={selectedExerciseId}
          onChange={(event) => handleSelectExercise(event.target.value)}
          disabled={isPending}
          className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
        >
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name} — {exercise.workoutName}
            </option>
          ))}
        </select>
        {selectedExercise ? (
          <p className="text-muted-foreground text-sm">
            Treino: {selectedExercise.workoutName}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <Card className="w-full border-destructive/40">
          <CardContent className="px-6 py-4 text-sm text-destructive">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}

      {isPending ? (
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Carregando progressão...
        </p>
      ) : null}

      {progress ? (
        <div className="flex w-full flex-col gap-6">
          {progress.history.length > 0 ? (
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
              <p className="text-muted-foreground text-sm">Melhor carga</p>
              <p className="text-2xl font-semibold">
                {Math.max(...progress.history.map((entry) => entry.weight))} kg
              </p>
            </div>
          ) : null}
          <ProgressChart history={progress.history} />
          <ProgressHistoryTable progress={progress} />
        </div>
      ) : null}
    </div>
  );
}
