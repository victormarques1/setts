import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/current-user";
import { LogoutButton } from "@/modules/auth/components/logout-button";
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
        <div className="flex flex-col items-end gap-2">
          {workouts.length > 0 ? (
            <Button render={<Link href="/workouts/new" />} nativeButton={false}>
              Novo treino
            </Button>
          ) : null}
          <Button
            variant="outline"
            render={<Link href="/history" />}
            nativeButton={false}
          >
            Histórico
          </Button>
          <LogoutButton />
        </div>
      </div>
      <WorkoutList workouts={workouts} />
    </div>
  );
}
