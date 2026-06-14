"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { EditActionButton } from "@/components/actions/edit-action-button";
import { DeleteActionButton } from "@/components/actions/delete-action-button";
import { DeleteWorkoutDialog } from "@/modules/workouts/components/delete-workout-dialog";
import { EditWorkoutDialog } from "@/modules/workouts/components/edit-workout-dialog";
import type { WorkoutSummary } from "@/modules/workouts/services/workout.service";

type WorkoutListItemProps = {
  workout: WorkoutSummary;
};

function formatExerciseCount(count: number) {
  if (count === 1) {
    return "1 exercício";
  }

  return `${count} exercícios`;
}

function formatLastSession(lastSessionAt: Date | null) {
  if (!lastSessionAt) {
    return "Sem sessões";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(lastSessionAt);
}

export function WorkoutListItem({ workout }: WorkoutListItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <li>
        <div className="list-card-interactive px-4 py-3.5">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <Link
              href={`/workouts/${workout.id}`}
              className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                className="min-w-0 truncate font-semibold tracking-tight"
                title={workout.name}
              >
                {workout.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatExerciseCount(workout.exerciseCount)}
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex flex-col items-end gap-0.5">
                <span className="metric-label">Última sessão</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatLastSession(workout.lastSessionAt)}
                </span>
              </div>
              <EditActionButton
                entityName={workout.name}
                onClick={() => setIsEditOpen(true)}
              />
              <DeleteActionButton
                entityName={workout.name}
                onClick={() => setIsDeleteOpen(true)}
              />
              <Link
                href={`/workouts/${workout.id}`}
                className="text-muted-foreground rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`Abrir ${workout.name}`}
              >
                <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </li>
      {isEditOpen ? (
        <EditWorkoutDialog
          workoutId={workout.id}
          workoutName={workout.name}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}
      {isDeleteOpen ? (
        <DeleteWorkoutDialog
          workoutId={workout.id}
          workoutName={workout.name}
          onClose={() => setIsDeleteOpen(false)}
        />
      ) : null}
    </>
  );
}
