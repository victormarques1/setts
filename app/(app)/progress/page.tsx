import { getCurrentUserId } from "@/lib/current-user";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import { ProgressView } from "@/modules/progress/components/progress-view";
import { progressService } from "@/modules/progress/services/progress.service";

export default async function ProgressPage() {
  const userId = await getCurrentUserId();
  const exercises = await exerciseService.listByUserId(userId);
  const initialExerciseId = exercises[0]?.id;
  const initialProgress = initialExerciseId
    ? await progressService.getExerciseProgress(initialExerciseId, userId)
    : null;

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Progressão</h1>
        <p className="page-subtitle">
          Acompanhe recordes, gráficos e evolução da carga em cada exercício.
        </p>
      </div>
      <ProgressView
        exercises={exercises}
        initialExerciseId={initialExerciseId}
        initialProgress={initialProgress}
      />
    </div>
  );
}
