"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import type { WorkoutExercise } from "@/modules/exercises/repositories/exercise.repository";
import {
  exerciseService,
  ExerciseCatalogDuplicateError,
  WorkoutNotFoundError,
} from "@/modules/exercises/services/exercise.service";
import { deleteExerciseService } from "@/modules/exercises/services/delete-exercise.service";
import {
  ExerciseNotEditableError,
  ExerciseNotFoundError,
  updateExerciseService,
} from "@/modules/exercises/services/update-exercise.service";
import type { UpdateExerciseFormInput } from "@/modules/exercises/validations/exercise.schema";
import { workoutService } from "@/modules/workouts/services/workout.service";

export async function listExercisesAction(
  workoutId: string,
): Promise<ActionResult<WorkoutExercise[]>> {
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

export async function updateExerciseAction(
  workoutId: string,
  exerciseId: string,
  input: UpdateExerciseFormInput,
): Promise<ActionResult<WorkoutExercise | null>> {
  try {
    const userId = await getCurrentUserId();
    const exercise = await updateExerciseService.update(
      { ...input, id: exerciseId },
      userId,
      workoutId,
    );
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(exercise);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseNotEditableError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseCatalogDuplicateError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível atualizar o exercício.");
  }
}

export async function deleteExerciseAction(
  workoutId: string,
  exerciseId: string,
): Promise<ActionResult<void>> {
  try {
    const userId = await getCurrentUserId();
    await deleteExerciseService.delete({ id: exerciseId }, userId, workoutId);
    revalidatePath(`/workouts/${workoutId}`);
    revalidatePath("/progress");
    return actionSuccess(undefined);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível excluir o exercício.");
  }
}
