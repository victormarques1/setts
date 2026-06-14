import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutList } from "@/modules/workouts/components/workout-list";
import { workoutService } from "@/modules/workouts/services/workout.service";

export default async function WorkoutsPage() {
  const userId = await getCurrentUserId();
  const workouts = await workoutService.listByUserId(userId);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Treinos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie seus treinos e organize seus exercícios.
          </p>
        </div>
        {workouts.length > 0 ? (
          <Button
            className="w-full shrink-0 sm:w-auto"
            render={<Link href="/workouts/new" />}
            nativeButton={false}
          >
            Novo treino
          </Button>
        ) : null}
      </div>
      <WorkoutList workouts={workouts} />
    </div>
  );
}
