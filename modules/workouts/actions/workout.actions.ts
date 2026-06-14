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
import { workoutService } from "@/modules/workouts/services/workout.service";
import type { CreateWorkoutFormInput } from "@/modules/workouts/validations/workout.schema";

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
