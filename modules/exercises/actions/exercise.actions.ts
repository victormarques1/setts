"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { exerciseService } from "@/modules/exercises/services/exercise.service";
import type { CreateExerciseInput } from "@/modules/exercises/validations/exercise.schema";
import type { Exercise } from "@/app/generated/prisma/client";

export async function listExercisesAction(
  workoutId: string,
): Promise<ActionResult<Exercise[]>> {
  try {
    const exercises = await exerciseService.listByWorkoutId(workoutId);
    return actionSuccess(exercises);
  } catch {
    return actionError("Não foi possível listar os exercícios.");
  }
}

export async function createExerciseAction(
  input: CreateExerciseInput,
): Promise<ActionResult<Exercise>> {
  try {
    const exercise = await exerciseService.create(input);
    return actionSuccess(exercise);
  } catch {
    return actionError("Não foi possível criar o exercício.");
  }
}
