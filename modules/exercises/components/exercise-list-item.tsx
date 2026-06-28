"use client";

import { useState } from "react";

import { EditActionButton } from "@/components/actions/edit-action-button";
import { DeleteActionButton } from "@/components/actions/delete-action-button";
import { formatWeight } from "@/lib/format-weight";
import { DeleteExerciseDialog } from "@/modules/exercises/components/delete-exercise-dialog";
import { EditExerciseDialog } from "@/modules/exercises/components/edit-exercise-dialog";
import type { ExerciseSummary } from "@/modules/exercises/services/exercise.service";

type ExerciseListItemProps = {
  workoutId: string;
  exercise: ExerciseSummary;
};

function formatLastLoad(lastLoad: ExerciseSummary["lastLoad"]) {
  if (!lastLoad) {
    return null;
  }

  return {
    weight: formatWeight(lastLoad.weight),
    reps: lastLoad.reps,
  };
}

export function ExerciseListItem({ workoutId, exercise }: ExerciseListItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const lastLoad = formatLastLoad(exercise.lastLoad);

  return (
    <>
      <li>
        <div className="list-card px-4 py-3.5">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <div className="min-w-0">
              <span
                className="block truncate font-semibold tracking-tight"
                title={exercise.name}
              >
                {exercise.name}
              </span>
              {exercise.muscleGroup ? (
                <span className="text-muted-foreground text-xs font-medium">
                  {exercise.muscleGroup}
                </span>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {lastLoad ? (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="metric-label">Última carga</span>
                  <span className="metric-value-primary">
                    {lastLoad.weight}
                    <span className="text-sm font-semibold text-primary/80">
                      {" "}
                      kg
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      {" "}
                      × {lastLoad.reps}
                    </span>
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-xs font-medium">
                  Sem registro
                </span>
              )}
              {exercise.isCustom ? (
                <EditActionButton
                  entityName={exercise.name}
                  onClick={() => setIsEditOpen(true)}
                />
              ) : null}
              <DeleteActionButton
                entityName={exercise.name}
                onClick={() => setIsDeleteOpen(true)}
              />
            </div>
          </div>
        </div>
      </li>
      {isEditOpen ? (
        <EditExerciseDialog
          workoutId={workoutId}
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}
      {isDeleteOpen ? (
        <DeleteExerciseDialog
          workoutId={workoutId}
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          onClose={() => setIsDeleteOpen(false)}
        />
      ) : null}
    </>
  );
}
