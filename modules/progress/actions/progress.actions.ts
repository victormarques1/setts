"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  ExerciseNotFoundError,
  progressService,
  type ExerciseProgressView,
} from "@/modules/progress/services/progress.service";

export async function getExerciseProgressAction(
  exerciseId: string,
): Promise<ActionResult<ExerciseProgressView>> {
  try {
    const progress = await progressService.getExerciseProgress(exerciseId);
    return actionSuccess(progress);
  } catch (error) {
    if (error instanceof ExerciseNotFoundError) {
      return actionError(error.message);
    }

    return actionError("Não foi possível carregar a progressão.");
  }
}
