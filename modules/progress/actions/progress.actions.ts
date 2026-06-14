"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  progressService,
  type ExerciseProgressPoint,
} from "@/modules/progress/services/progress.service";

export async function getExerciseProgressAction(
  exerciseId: string,
): Promise<ActionResult<ExerciseProgressPoint[]>> {
  try {
    const progress = await progressService.getExerciseProgress(exerciseId);
    return actionSuccess(progress);
  } catch {
    return actionError("Não foi possível carregar a progressão.");
  }
}
