"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  progressService,
  type ProgressDataPoint,
} from "@/modules/progress/services/progress.service";
import type { ProgressQueryInput } from "@/modules/progress/validations/progress.schema";

export async function getExerciseProgressAction(
  input: ProgressQueryInput,
): Promise<ActionResult<ProgressDataPoint[]>> {
  try {
    const progress = await progressService.getExerciseProgress(input);
    return actionSuccess(progress);
  } catch {
    return actionError("Não foi possível carregar a progressão.");
  }
}
