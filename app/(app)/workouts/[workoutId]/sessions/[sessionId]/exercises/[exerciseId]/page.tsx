import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import { CancelSessionButton } from "@/modules/sessions/components/cancel-session-button";
import { SetLoggerForm } from "@/modules/sessions/components/set-logger-form";
import { SetRecordList } from "@/modules/sessions/components/set-record-list";
import { sessionService } from "@/modules/sessions/services/session.service";
import { workoutService } from "@/modules/workouts/services/workout.service";

type ExerciseLoggerPageProps = {
  params: Promise<{
    workoutId: string;
    sessionId: string;
    exerciseId: string;
  }>;
};

export default async function ExerciseLoggerPage({
  params,
}: ExerciseLoggerPageProps) {
  const { workoutId, sessionId, exerciseId } = await params;
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

  const exercise = await exerciseService.getByIdForWorkout(
    exerciseId,
    workoutId,
  );

  if (!exercise) {
    notFound();
  }

  const sets = await sessionService.listSetRecords(
    sessionId,
    exerciseId,
    userId,
  );

  const nextSetNumber =
    sets.length > 0 ? sets[sets.length - 1].setNumber + 1 : 1;
  const lastSet =
    sets.length > 0
      ? { weight: sets[sets.length - 1].weight, reps: sets[sets.length - 1].reps }
      : null;
  const isActive = session.status === WorkoutSessionStatus.ACTIVE;

  return (
    <div className={isActive ? "page-shell page-shell-sticky-form" : "page-shell"}>
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="back-link"
          render={
            <Link href={`/workouts/${workoutId}/sessions/${sessionId}`} />
          }
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1
              className="page-title break-words"
              title={exercise.name}
            >
              {exercise.name}
            </h1>
            <p className="page-subtitle">
              {isActive
                ? "Registre peso e repetições de cada série."
                : "Visualização das séries registradas neste treino."}
            </p>
          </div>
          {isActive ? (
            <CancelSessionButton
              workoutId={workoutId}
              sessionId={sessionId}
            />
          ) : null}
        </div>
      </div>

      <SetRecordList
        workoutId={workoutId}
        sessionId={sessionId}
        exerciseId={exerciseId}
        sets={sets}
      />

      {isActive ? (
        <div className="fixed-above-nav-form">
          <SetLoggerForm
            key={nextSetNumber}
            workoutId={workoutId}
            sessionId={sessionId}
            exerciseId={exerciseId}
            nextSetNumber={nextSetNumber}
            lastSet={lastSet}
          />
        </div>
      ) : null}
    </div>
  );
}
