"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Exercise } from "@/app/generated/prisma/client";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import {
  exerciseService,
  WorkoutNotFoundError,
} from "@/modules/exercises/services/exercise.service";
import type { CreateExerciseFormInput } from "@/modules/exercises/validations/exercise.schema";
import { workoutService } from "@/modules/workouts/services/workout.service";

export async function listExercisesAction(
  workoutId: string,
): Promise<ActionResult<Exercise[]>> {
  try {
    const userId = await getCurrentUserId();
    const workout = await workoutService.getByIdForUser(workoutId, userId);

    if (!workout) {
      return actionError("Treino não encontrado.");
    }

    const exercises = await exerciseService.listByWorkoutId(workoutId);
    return actionSuccess(exercises);
  } catch {
    return actionError("Não foi possível listar os exercícios.");
  }
}

export async function createExerciseAction(
  workoutId: string,
  input: CreateExerciseFormInput,
): Promise<ActionResult<Exercise>> {
  try {
    const userId = await getCurrentUserId();
    const exercise = await exerciseService.create(
      { ...input, workoutId },
      userId,
    );
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(exercise);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível criar o exercício.");
  }
}
