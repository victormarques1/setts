import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import { SessionActionBar } from "@/modules/sessions/components/session-action-bar";
import { SessionExerciseList } from "@/modules/sessions/components/session-exercise-list";
import { sessionService } from "@/modules/sessions/services/session.service";
import { workoutService } from "@/modules/workouts/services/workout.service";

type SessionPageProps = {
  params: Promise<{ workoutId: string; sessionId: string }>;
};

function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { workoutId, sessionId } = await params;
  const userId = await getCurrentUserId();
  const workout = await workoutService.getByIdForUser(workoutId, userId);

  if (!workout) {
    notFound();
  }

  const session = await sessionService.getByIdForUser(sessionId, userId);

  if (!session || session.workoutId !== workoutId) {
    notFound();
  }

  if (session.status === WorkoutSessionStatus.CANCELED) {
    notFound();
  }

  const exercises = await exerciseService.listByWorkoutId(workoutId);
  const isActive = session.status === WorkoutSessionStatus.ACTIVE;

  const setCountByExercise = session.setRecords.reduce<Record<string, number>>(
    (counts, set) => {
      counts[set.exerciseId] = (counts[set.exerciseId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const completedExercises = exercises.filter(
    (exercise) => (setCountByExercise[exercise.id] ?? 0) > 0,
  ).length;

  return (
    <div className={isActive ? "page-shell page-shell-sticky-bar" : "page-shell"}>
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="back-link"
          render={
            <Link
              href={
                session.status === WorkoutSessionStatus.COMPLETED
                  ? "/history"
                  : `/workouts/${workoutId}`
              }
            />
          }
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex flex-col gap-1">
          <h1
            className="page-title break-words"
            title={workout.name}
          >
            {workout.name}
          </h1>
          <p className="page-subtitle">
            {isActive
              ? "Treino em andamento. Suas séries ficam salvas ao sair e voltar."
              : session.performedAt
                ? `Finalizado em ${formatSessionDate(session.performedAt)}`
                : "Treino finalizado"}
          </p>
        </div>
      </div>
      <SessionExerciseList
        workoutId={workoutId}
        sessionId={sessionId}
        exercises={exercises}
        setRecords={session.setRecords}
        isActive={isActive}
      />
      {isActive ? (
        <SessionActionBar
          workoutId={workoutId}
          sessionId={sessionId}
          completedExercises={completedExercises}
          totalExercises={exercises.length}
          totalSets={session.setRecords.length}
        />
      ) : null}
    </div>
  );
}
