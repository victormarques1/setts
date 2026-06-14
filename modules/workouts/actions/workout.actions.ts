"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { workoutService } from "@/modules/workouts/services/workout.service";
import type { CreateWorkoutInput } from "@/modules/workouts/validations/workout.schema";
import type { Workout } from "@/app/generated/prisma/client";

export async function listWorkoutsAction(
  userId: string,
): Promise<ActionResult<Workout[]>> {
  try {
    const workouts = await workoutService.listByUserId(userId);
    return actionSuccess(workouts);
  } catch {
    return actionError("Não foi possível listar os treinos.");
  }
}

export async function createWorkoutAction(
  input: CreateWorkoutInput,
): Promise<ActionResult<Workout>> {
  try {
    const workout = await workoutService.create(input);
    return actionSuccess(workout);
  } catch {
    return actionError("Não foi possível criar o treino.");
  }
}
