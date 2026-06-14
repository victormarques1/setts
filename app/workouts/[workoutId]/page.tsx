import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { ExerciseList } from "@/modules/exercises/components/exercise-list";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
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

  const exercises = await exerciseService.listByWorkoutId(workoutId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="w-fit px-0 hover:bg-transparent"
          render={<Link href="/workouts" />}
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {workout.name}
            </h1>
            <p className="text-muted-foreground">
              Exercícios deste treino.
            </p>
          </div>
          {exercises.length > 0 ? (
            <Button
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
      <ExerciseList workoutId={workoutId} exercises={exercises} />
    </div>
  );
}
