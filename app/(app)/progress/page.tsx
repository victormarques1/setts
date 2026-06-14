import { getCurrentUserId } from "@/lib/current-user";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import { ProgressView } from "@/modules/progress/components/progress-view";

export default async function ProgressPage() {
  const userId = await getCurrentUserId();
  const exercises = await exerciseService.listByUserId(userId);

  return (
    <div className="page-shell flex min-h-0 flex-1 flex-col">
      <ProgressView exercises={exercises} />
    </div>
  );
}
