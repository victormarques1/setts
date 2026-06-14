"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import {
  ExerciseNotFoundError,
  progressService,
  type ExerciseProgressView,
} from "@/modules/progress/services/progress.service";

export async function getExerciseProgressAction(
  exerciseId: string,
): Promise<ActionResult<ExerciseProgressView>> {
  try {
    const userId = await getCurrentUserId();
    const progress = await progressService.getExerciseProgress(
      exerciseId,
      userId,
    );
    return actionSuccess(progress);
  } catch (error) {
    if (error instanceof ExerciseNotFoundError) {
      return actionError(error.message);
    }

    return actionError("Não foi possível carregar a progressão.");
  }
}
