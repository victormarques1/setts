"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { DeleteWorkoutDialog } from "@/modules/workouts/components/delete-workout-dialog";
import { EditWorkoutDialog } from "@/modules/workouts/components/edit-workout-dialog";
import { WorkoutItemMenu } from "@/modules/workouts/components/workout-item-menu";
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
      <li className="relative">
        <Link
          href={`/workouts/${workout.id}`}
          aria-label={`${workout.name}, abrir treino para iniciar sessão`}
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="list-card-interactive px-4 py-3.5 pr-14">
            <div className="flex min-h-11 items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  className="min-w-0 truncate font-semibold tracking-tight"
                  title={workout.name}
                >
                  {workout.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatExerciseCount(workout.exerciseCount)}
                  <span aria-hidden="true"> · </span>
                  <span className="text-primary/80 transition-colors group-hover:text-primary">
                    Iniciar sessão
                  </span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="metric-label">Última sessão</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatLastSession(workout.lastSessionAt)}
                  </span>
                </div>
                <ChevronRight
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </Link>
        <WorkoutItemMenu
          workoutName={workout.name}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
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
