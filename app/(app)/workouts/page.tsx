import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutList } from "@/modules/workouts/components/workout-list";
import { workoutService } from "@/modules/workouts/services/workout.service";

export default async function WorkoutsPage() {
  const userId = await getCurrentUserId();
  const workouts = await workoutService.listSummariesByUserId(userId);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-2">
        <h1 className="page-title">Treinos</h1>
        <p className="page-subtitle">
          Selecione um treino para ver os exercícios e iniciar uma sessão.
        </p>
      </div>
      <WorkoutList workouts={workouts} />
    </div>
  );
}
