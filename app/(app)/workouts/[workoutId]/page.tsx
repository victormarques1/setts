import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { ExerciseList } from "@/modules/exercises/components/exercise-list";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import { ActiveSessionBanner } from "@/modules/sessions/components/active-session-banner";
import { StartSessionButton } from "@/modules/sessions/components/start-session-button";
import { StartSessionFab } from "@/modules/sessions/components/start-session-fab";
import { sessionService } from "@/modules/sessions/services/session.service";
import { workoutService } from "@/modules/workouts/services/workout.service";

type WorkoutPageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { workoutId } = await params;
  const userId = await getCurrentUserId();
  const workout = await workoutService.getByIdForUser(workoutId, userId);

  if (!workout) {
    notFound();
  }

  const exercises = await exerciseService.listSummariesByWorkoutId(workoutId);
  const activeSession = await sessionService.getActiveSession(workoutId, userId);

  return (
    <div className={exercises.length > 0 ? "page-shell page-shell-sticky-fab" : "page-shell"}>
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="back-link"
          render={<Link href="/workouts" />}
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h1
              className="page-title break-words"
              title={workout.name}
            >
              {workout.name}
            </h1>
            <p className="page-subtitle">
              Exercícios deste treino.
            </p>
          </div>
          <div className="hidden w-full flex-col gap-2 sm:flex sm:w-auto sm:items-end">
            {exercises.length > 0 && !activeSession ? (
              <StartSessionButton workoutId={workoutId} />
            ) : null}
            {exercises.length > 0 ? (
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                render={
                  <Link href={`/workouts/${workoutId}/exercises/new`} />
                }
                nativeButton={false}
              >
                Novo exercício
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {activeSession ? (
        <ActiveSessionBanner
          workoutId={workoutId}
          sessionId={activeSession.id}
        />
      ) : null}
      <ExerciseList workoutId={workoutId} exercises={exercises} />
      {exercises.length > 0 ? (
        <>
          {!activeSession ? (
            <StartSessionFab workoutId={workoutId} />
          ) : null}
          <div className="flex flex-col gap-2 md:hidden">
            <Button
              className="w-full"
              variant="outline"
              render={
                <Link href={`/workouts/${workoutId}/exercises/new`} />
              }
              nativeButton={false}
            >
              Novo exercício
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
