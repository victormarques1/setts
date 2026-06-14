"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { UserExerciseSummary } from "@/modules/exercises/services/exercise.service";
import { getExerciseProgressAction } from "@/modules/progress/actions/progress.actions";
import { ProgressExerciseDetail } from "@/modules/progress/components/progress-exercise-detail";
import { ProgressExerciseList } from "@/modules/progress/components/progress-exercise-list";
import { ProgressSearchBar } from "@/modules/progress/components/progress-search-bar";
import { ProgressWorkoutChips } from "@/modules/progress/components/progress-workout-chips";
import type { ExerciseProgressView } from "@/modules/progress/services/progress.service";

type ProgressViewProps = {
  exercises: UserExerciseSummary[];
};

function getUniqueWorkoutNames(exercises: UserExerciseSummary[]) {
  const names: string[] = [];
  const seen = new Set<string>();

  for (const exercise of exercises) {
    if (seen.has(exercise.workoutName)) {
      continue;
    }

    seen.add(exercise.workoutName);
    names.push(exercise.workoutName);
  }

  return names;
}

export function ProgressView({ exercises }: ProgressViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<UserExerciseSummary | null>(null);
  const [progress, setProgress] = useState<ExerciseProgressView | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingExerciseId, setLoadingExerciseId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const workoutNames = useMemo(
    () => getUniqueWorkoutNames(exercises),
    [exercises],
  );

  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return exercises.filter((exercise) => {
      if (selectedWorkout && exercise.workoutName !== selectedWorkout) {
        return false;
      }

      if (
        normalizedQuery &&
        !exercise.name.toLowerCase().includes(normalizedQuery)
      ) {
        return false;
      }

      return true;
    });
  }, [exercises, searchQuery, selectedWorkout]);

  function loadExerciseProgress(exerciseId: string) {
    setErrorMessage(null);
    setProgress(null);
    setLoadingExerciseId(exerciseId);

    startTransition(async () => {
      const result = await getExerciseProgressAction(exerciseId);

      if (!result.success) {
        setProgress(null);
        setErrorMessage(result.error);
        setLoadingExerciseId(null);
        return;
      }

      setProgress(result.data);
      setLoadingExerciseId(null);
    });
  }

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = exercises.find((item) => item.id === exerciseId);

    if (!exercise || exercise.id === selectedExercise?.id) {
      return;
    }

    setSelectedExercise(exercise);
    loadExerciseProgress(exerciseId);
  };

  const handleBack = () => {
    setSelectedExercise(null);
    setProgress(null);
    setErrorMessage(null);
    setLoadingExerciseId(null);
  };

  const handleRetry = () => {
    if (!selectedExercise) {
      return;
    }

    loadExerciseProgress(selectedExercise.id);
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

  if (selectedExercise) {
    return (
      <ProgressExerciseDetail
        exerciseName={selectedExercise.name}
        workoutName={selectedExercise.workoutName}
        progress={progress}
        isPending={isPending}
        errorMessage={errorMessage}
        onBack={handleBack}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Progressão</h1>
        <p className="page-subtitle">
          Veja sua última carga, recorde e evolução em cada exercício.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ProgressSearchBar value={searchQuery} onChange={setSearchQuery} />
        <ProgressWorkoutChips
          workouts={workoutNames}
          selectedWorkout={selectedWorkout}
          onSelect={setSelectedWorkout}
        />
      </div>

      <ProgressExerciseList
        exercises={filteredExercises}
        selectedExerciseId=""
        loadingExerciseId={loadingExerciseId}
        onSelectExercise={handleSelectExercise}
      />
    </div>
  );
}
