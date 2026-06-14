"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
            <span
              className="min-w-0 truncate font-semibold tracking-tight"
              title={exercise.name}
            >
              {exercise.name}
            </span>
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
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Editar ${exercise.name}`}
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Excluir ${exercise.name}`}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 aria-hidden="true" />
              </Button>
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
