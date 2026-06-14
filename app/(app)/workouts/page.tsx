import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutList } from "@/modules/workouts/components/workout-list";
import { workoutService } from "@/modules/workouts/services/workout.service";

export default async function WorkoutsPage() {
  const userId = await getCurrentUserId();
  const workouts = await workoutService.listSummariesByUserId(userId);

  return (
    <div className="page-shell">
      <h1 className="page-title">Treinos</h1>
      <WorkoutList workouts={workouts} />
    </div>
  );
}
