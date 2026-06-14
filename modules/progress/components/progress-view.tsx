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
import { cn } from "@/lib/utils";
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
      <Card className="w-full max-w-lg">
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

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Exercício</h2>
        <ul className="flex flex-col gap-2">
          {exercises.map((exercise) => {
            const isSelected = exercise.id === selectedExerciseId;

            return (
              <li key={exercise.id}>
                <button
                  type="button"
                  onClick={() => handleSelectExercise(exercise.id)}
                  disabled={isPending && isSelected}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50",
                    isPending && isSelected && "opacity-70",
                  )}
                >
                  <span className="block font-medium">{exercise.name}</span>
                  <span className="text-muted-foreground block text-sm">
                    {exercise.workoutName}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {errorMessage ? (
        <Card className="w-full border-destructive/40">
          <CardContent className="px-6 py-4 text-sm text-destructive">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}

      {isPending ? (
        <p className="text-muted-foreground text-sm">Carregando progressão...</p>
      ) : null}

      {progress ? (
        <div className="flex w-full flex-col gap-6">
          <ProgressChart history={progress.history} />
          <ProgressHistoryTable progress={progress} />
        </div>
      ) : null}
    </div>
  );
}
