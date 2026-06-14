import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
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
  const isActive = session.status === WorkoutSessionStatus.IN_PROGRESS;

  return (
    <div className="page-shell">
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
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-3xl">
            {exercise.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isActive
              ? "Registre peso e repetições de cada série."
              : "Visualização das séries registradas neste treino."}
          </p>
        </div>
      </div>
      <SetRecordList sets={sets} />
      {isActive ? (
        <SetLoggerForm
          key={nextSetNumber}
          workoutId={workoutId}
          sessionId={sessionId}
          exerciseId={exerciseId}
          nextSetNumber={nextSetNumber}
        />
      ) : null}
    </div>
  );
}
