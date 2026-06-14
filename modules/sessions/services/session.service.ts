import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import {
  completeSessionSchema,
  createSessionSchema,
  createSetRecordFormSchema,
  createSetRecordSchema,
  type CreateSetRecordFormInput,
} from "@/modules/sessions/validations/session.schema";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";

export class SessionNotFoundError extends Error {
  constructor() {
    super("Sessão não encontrada.");
    this.name = "SessionNotFoundError";
  }
}

export class ExerciseNotFoundError extends Error {
  constructor() {
    super("Exercício não encontrado.");
    this.name = "ExerciseNotFoundError";
  }
}

export class SessionNotActiveError extends Error {
  constructor() {
    super("Este treino já foi finalizado.");
    this.name = "SessionNotActiveError";
  }
}

export type CompletedSessionSummary = {
  id: string;
  workoutId: string;
  workoutName: string;
  performedAt: Date;
};

export const sessionService = {
  listByWorkoutId(workoutId: string) {
    return sessionRepository.findByWorkoutId(workoutId);
  },

  getByIdForUser(id: string, userId: string) {
    return sessionRepository.findByIdForUser(id, userId);
  },

  getActiveSession(workoutId: string, userId: string) {
    return sessionRepository.findActiveByWorkoutIdForUser(workoutId, userId);
  },

  async listCompletedByUserId(userId: string): Promise<CompletedSessionSummary[]> {
    const sessions = await sessionRepository.findCompletedByUserId(userId);

    return sessions.flatMap((session) => {
      if (!session.performedAt) {
        return [];
      }

      return [
        {
          id: session.id,
          workoutId: session.workout.id,
          workoutName: session.workout.name,
          performedAt: session.performedAt,
        },
      ];
    });
  },

  async startSession(workoutId: string, userId: string) {
    const workout = await workoutRepository.findByIdForUser(workoutId, userId);

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    const activeSession = await sessionRepository.findActiveByWorkoutIdForUser(
      workoutId,
      userId,
    );

    if (activeSession) {
      return activeSession;
    }

    const data = createSessionSchema.parse({ workoutId });
    return sessionRepository.create(data);
  },

  async completeSession(sessionId: string, userId: string) {
    completeSessionSchema.parse({ sessionId });

    const session = await sessionRepository.findByIdForUser(sessionId, userId);

    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.status !== WorkoutSessionStatus.IN_PROGRESS) {
      throw new SessionNotActiveError();
    }

    return sessionRepository.complete(sessionId, new Date());
  },

  async listSetRecords(sessionId: string, exerciseId: string, userId: string) {
    const session = await sessionRepository.findByIdForUser(sessionId, userId);

    if (!session) {
      throw new SessionNotFoundError();
    }

    const exercise = await exerciseRepository.findByIdForWorkout(
      exerciseId,
      session.workoutId,
    );

    if (!exercise) {
      throw new ExerciseNotFoundError();
    }

    return sessionRepository.findSetRecordsBySessionAndExercise(
      sessionId,
      exerciseId,
    );
  },

  async recordSet(
    sessionId: string,
    exerciseId: string,
    input: CreateSetRecordFormInput,
    userId: string,
  ) {
    const formData = createSetRecordFormSchema.parse(input);
    const session = await sessionRepository.findByIdForUser(sessionId, userId);

    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.status !== WorkoutSessionStatus.IN_PROGRESS) {
      throw new SessionNotActiveError();
    }

    const exercise = await exerciseRepository.findByIdForWorkout(
      exerciseId,
      session.workoutId,
    );

    if (!exercise) {
      throw new ExerciseNotFoundError();
    }

    const maxSetNumber = await sessionRepository.findMaxSetNumber(
      sessionId,
      exerciseId,
    );
    const setNumber = (maxSetNumber._max.setNumber ?? 0) + 1;

    const data = createSetRecordSchema.parse({
      ...formData,
      sessionId,
      exerciseId,
      setNumber,
    });

    return sessionRepository.createSetRecord(data);
  },
};
