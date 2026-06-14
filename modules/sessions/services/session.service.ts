import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import {
  createSessionSchema,
  createSetRecordSchema,
  type CreateSessionInput,
  type CreateSetRecordInput,
} from "@/modules/sessions/validations/session.schema";

export const sessionService = {
  listByWorkoutId(workoutId: string) {
    return sessionRepository.findByWorkoutId(workoutId);
  },

  getById(id: string) {
    return sessionRepository.findById(id);
  },

  startSession(input: CreateSessionInput) {
    const data = createSessionSchema.parse(input);
    return sessionRepository.create(data);
  },

  recordSet(input: CreateSetRecordInput) {
    const data = createSetRecordSchema.parse(input);
    return sessionRepository.createSetRecord(data);
  },
};
