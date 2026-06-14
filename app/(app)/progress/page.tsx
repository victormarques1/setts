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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Progressão</h1>
        <p className="text-muted-foreground">
          Acompanhe a evolução da carga em cada exercício.
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
