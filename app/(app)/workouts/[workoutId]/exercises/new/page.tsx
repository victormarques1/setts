import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { CreateExerciseForm } from "@/modules/exercises/components/create-exercise-form";
import { workoutService } from "@/modules/workouts/services/workout.service";

type NewExercisePageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function NewExercisePage({ params }: NewExercisePageProps) {
  const { workoutId } = await params;
  const userId = await getCurrentUserId();
  const workout = await workoutService.getByIdForUser(workoutId, userId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="back-link"
          render={<Link href={`/workouts/${workoutId}`} />}
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="page-title">
            Criar exercício
          </h1>
          <p className="page-subtitle">
            Adicione um exercício ao treino {workout.name}.
          </p>
        </div>
      </div>
      <CreateExerciseForm workoutId={workoutId} />
    </div>
  );
}
