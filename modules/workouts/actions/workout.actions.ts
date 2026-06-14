"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Workout } from "@/app/generated/prisma/client";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import { deleteWorkoutService } from "@/modules/workouts/services/delete-workout.service";
import { updateWorkoutService } from "@/modules/workouts/services/update-workout.service";
import { workoutService } from "@/modules/workouts/services/workout.service";
import type {
  CreateWorkoutFormInput,
  UpdateWorkoutFormInput,
} from "@/modules/workouts/validations/workout.schema";

export async function listWorkoutsAction(): Promise<ActionResult<Workout[]>> {
  try {
    const userId = await getCurrentUserId();
    const workouts = await workoutService.listByUserId(userId);
    return actionSuccess(workouts);
  } catch {
    return actionError("Não foi possível listar os treinos.");
  }
}

export async function createWorkoutAction(
  input: CreateWorkoutFormInput,
): Promise<ActionResult<Workout>> {
  try {
    const userId = await getCurrentUserId();
    const workout = await workoutService.create({ ...input, userId });
    revalidatePath("/workouts");
    return actionSuccess(workout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível criar o treino.");
  }
}

export async function updateWorkoutAction(
  workoutId: string,
  input: UpdateWorkoutFormInput,
): Promise<ActionResult<Workout>> {
  try {
    const userId = await getCurrentUserId();
    const workout = await updateWorkoutService.update(
      { ...input, id: workoutId },
      userId,
    );
    revalidatePath("/workouts");
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(workout);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível atualizar o treino.");
  }
}

export async function deleteWorkoutAction(
  workoutId: string,
): Promise<ActionResult<void>> {
  try {
    const userId = await getCurrentUserId();
    await deleteWorkoutService.delete({ id: workoutId }, userId);
    revalidatePath("/workouts");
    return actionSuccess(undefined);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível excluir o treino.");
  }
}
