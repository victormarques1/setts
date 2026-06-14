"use server";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { sessionService } from "@/modules/sessions/services/session.service";
import type {
  CreateSessionInput,
  CreateSetRecordInput,
} from "@/modules/sessions/validations/session.schema";
import type { SetRecord, WorkoutSession } from "@/app/generated/prisma/client";

type WorkoutSessionWithSets = WorkoutSession & { setRecords: SetRecord[] };

export async function listSessionsAction(
  workoutId: string,
): Promise<ActionResult<WorkoutSessionWithSets[]>> {
  try {
    const sessions = await sessionService.listByWorkoutId(workoutId);
    return actionSuccess(sessions);
  } catch {
    return actionError("Não foi possível listar o histórico de treinos.");
  }
}

export async function startSessionAction(
  input: CreateSessionInput,
): Promise<ActionResult<WorkoutSession>> {
  try {
    const session = await sessionService.startSession(input);
    return actionSuccess(session);
  } catch {
    return actionError("Não foi possível iniciar o treino.");
  }
}

export async function recordSetAction(
  input: CreateSetRecordInput,
): Promise<ActionResult<SetRecord>> {
  try {
    const setRecord = await sessionService.recordSet(input);
    return actionSuccess(setRecord);
  } catch {
    return actionError("Não foi possível registrar a série.");
  }
}
