"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import {
  exerciseCatalogService,
  type ExerciseCatalogItem,
} from "@/modules/exercises/services/exercise-catalog.service";
import {
  exerciseService,
  ExerciseAlreadyInWorkoutError,
  ExerciseCatalogDuplicateError,
  ExerciseCatalogNotFoundError,
  WorkoutNotFoundError,
} from "@/modules/exercises/services/exercise.service";
import type { WorkoutExercise } from "@/modules/exercises/repositories/exercise.repository";
import type {
  CreateCustomExerciseFormInput,
} from "@/modules/exercises/validations/exercise-catalog.schema";
import { workoutService } from "@/modules/workouts/services/workout.service";

export async function searchExerciseCatalogAction(
  workoutId: string,
  query: string,
): Promise<ActionResult<ExerciseCatalogItem[]>> {
  try {
    const userId = await getCurrentUserId();
    const workout = await workoutService.getByIdForUser(workoutId, userId);

    if (!workout) {
      return actionError("Treino não encontrado.");
    }

    const excludeCatalogIds =
      await exerciseService.getCatalogIdsInWorkout(workoutId);
    const items = await exerciseCatalogService.search(
      userId,
      query,
      excludeCatalogIds,
    );

    return actionSuccess(items);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível buscar os exercícios.");
  }
}

export async function addExerciseToWorkoutAction(
  workoutId: string,
  exerciseCatalogId: string,
): Promise<ActionResult<WorkoutExercise>> {
  try {
    const userId = await getCurrentUserId();
    const exercise = await exerciseService.addFromCatalog(
      { workoutId, exerciseCatalogId },
      userId,
    );
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(exercise);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseCatalogNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseAlreadyInWorkoutError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível adicionar o exercício.");
  }
}

export async function createCustomExerciseAndAddAction(
  workoutId: string,
  input: CreateCustomExerciseFormInput,
): Promise<ActionResult<WorkoutExercise>> {
  try {
    const userId = await getCurrentUserId();
    const exercise = await exerciseService.createCustomAndAdd(
      { ...input, workoutId },
      userId,
    );
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(exercise);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseCatalogDuplicateError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível criar o exercício.");
  }
}
