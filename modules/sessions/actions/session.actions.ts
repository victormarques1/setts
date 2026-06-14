"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { SetRecord, WorkoutSession } from "@/app/generated/prisma/client";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUserId } from "@/lib/current-user";
import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import {
  ExerciseNotFoundError,
  SessionNotActiveError,
  SessionNotFoundError,
  sessionService,
  type CompletedSessionSummary,
} from "@/modules/sessions/services/session.service";
import type { CreateSetRecordFormInput } from "@/modules/sessions/validations/session.schema";
import { workoutService } from "@/modules/workouts/services/workout.service";

type WorkoutSessionWithSets = WorkoutSession & { setRecords: SetRecord[] };

function getSessionPath(workoutId: string, sessionId: string) {
  return `/workouts/${workoutId}/sessions/${sessionId}`;
}

function getExerciseLoggerPath(
  workoutId: string,
  sessionId: string,
  exerciseId: string,
) {
  return `/workouts/${workoutId}/sessions/${sessionId}/exercises/${exerciseId}`;
}

export async function listCompletedSessionsAction(): Promise<
  ActionResult<CompletedSessionSummary[]>
> {
  try {
    const userId = await getCurrentUserId();
    const sessions = await sessionService.listCompletedByUserId(userId);
    return actionSuccess(sessions);
  } catch {
    return actionError("Não foi possível listar o histórico de treinos.");
  }
}

export async function listSessionsAction(
  workoutId: string,
): Promise<ActionResult<WorkoutSessionWithSets[]>> {
  try {
    const userId = await getCurrentUserId();
    const workout = await workoutService.getByIdForUser(workoutId, userId);

    if (!workout) {
      return actionError("Treino não encontrado.");
    }

    const sessions = await sessionService.listByWorkoutId(workoutId);
    return actionSuccess(sessions);
  } catch {
    return actionError("Não foi possível listar o histórico de treinos.");
  }
}

export async function startSessionAction(
  workoutId: string,
): Promise<ActionResult<WorkoutSession>> {
  try {
    const userId = await getCurrentUserId();
    const session = await sessionService.startSession(workoutId, userId);
    revalidatePath(`/workouts/${workoutId}`);
    revalidatePath(getSessionPath(workoutId, session.id));
    return actionSuccess(session);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return actionError(error.message);
    }

    return actionError("Não foi possível iniciar o treino.");
  }
}

export async function completeSessionAction(
  workoutId: string,
  sessionId: string,
): Promise<ActionResult<WorkoutSession>> {
  try {
    const userId = await getCurrentUserId();
    const session = await sessionService.completeSession(sessionId, userId);
    revalidatePath(`/workouts/${workoutId}`);
    revalidatePath(getSessionPath(workoutId, sessionId));
    revalidatePath("/history");
    return actionSuccess(session);
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof SessionNotActiveError) {
      return actionError(error.message);
    }

    return actionError("Não foi possível finalizar o treino.");
  }
}

export async function recordSetAction(
  workoutId: string,
  sessionId: string,
  exerciseId: string,
  input: CreateSetRecordFormInput,
): Promise<ActionResult<SetRecord>> {
  try {
    const userId = await getCurrentUserId();
    const setRecord = await sessionService.recordSet(
      sessionId,
      exerciseId,
      input,
      userId,
    );
    revalidatePath(getSessionPath(workoutId, sessionId));
    revalidatePath(getExerciseLoggerPath(workoutId, sessionId, exerciseId));
    revalidatePath(`/workouts/${workoutId}`);
    return actionSuccess(setRecord);
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof ExerciseNotFoundError) {
      return actionError(error.message);
    }

    if (error instanceof SessionNotActiveError) {
      return actionError(error.message);
    }

    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    return actionError("Não foi possível registrar a série.");
  }
}
