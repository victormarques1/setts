import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutList } from "@/modules/workouts/components/workout-list";
import { workoutService } from "@/modules/workouts/services/workout.service";

export default async function WorkoutsPage() {
  const userId = await getCurrentUserId();
  const workouts = await workoutService.listByUserId(userId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Treinos</h1>
          <p className="text-muted-foreground">
            Gerencie seus treinos e organize seus exercícios.
          </p>
        </div>
        {workouts.length > 0 ? (
          <div className="flex flex-col items-end gap-2">
            <Button render={<Link href="/workouts/new" />} nativeButton={false}>
              Novo treino
            </Button>
            <Button
              variant="outline"
              render={<Link href="/history" />}
              nativeButton={false}
            >
              Histórico
            </Button>
          </div>
        ) : (
          <Button render={<Link href="/history" />} nativeButton={false} variant="outline">
            Histórico
          </Button>
        )}
      </div>
      <WorkoutList workouts={workouts} />
    </div>
  );
}
