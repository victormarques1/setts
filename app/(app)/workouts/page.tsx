import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutList } from "@/modules/workouts/components/workout-list";
import { workoutService } from "@/modules/workouts/services/workout.service";

export default async function WorkoutsPage() {
  const userId = await getCurrentUserId();
  const workouts = await workoutService.listSummariesByUserId(userId);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="page-title">Treinos</h1>
          <p className="page-subtitle">
            Gerencie treinos e inicie sessões para registrar sua performance.
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
