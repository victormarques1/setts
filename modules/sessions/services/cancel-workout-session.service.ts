import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import { SessionNotFoundError } from "@/modules/sessions/services/session.service";
import { cancelSessionSchema } from "@/modules/sessions/validations/session.schema";

export class SessionNotCancelableError extends Error {
  constructor() {
    super("Apenas sessões ativas podem ser canceladas.");
    this.name = "SessionNotCancelableError";
  }
}

export const cancelWorkoutSessionService = {
  async cancel(sessionId: string, userId: string) {
    cancelSessionSchema.parse({ sessionId });

    const session = await sessionRepository.findByIdForUser(sessionId, userId);

    if (!session) {
      throw new SessionNotFoundError();
    }

    if (session.status !== WorkoutSessionStatus.ACTIVE) {
      throw new SessionNotCancelableError();
    }

    return sessionRepository.cancel(sessionId, new Date());
  },
};
