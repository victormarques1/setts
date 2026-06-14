import { setRecordRepository } from "@/modules/sessions/repositories/set-record.repository";
import {
  updateSetRecordSchema,
  type UpdateSetRecordFormInput,
} from "@/modules/sessions/validations/session.schema";

export class SetRecordNotFoundError extends Error {
  constructor() {
    super("Série não encontrada.");
    this.name = "SetRecordNotFoundError";
  }
}

export const updateSetRecordService = {
  async update(
    setRecordId: string,
    input: UpdateSetRecordFormInput,
    userId: string,
    workoutId: string,
    sessionId: string,
    exerciseId: string,
  ) {
    const data = updateSetRecordSchema.parse({ ...input, id: setRecordId });

    const setRecord = await setRecordRepository.findByIdForUserContext(
      data.id,
      userId,
      workoutId,
      sessionId,
      exerciseId,
    );

    if (!setRecord) {
      throw new SetRecordNotFoundError();
    }

    return setRecordRepository.update(data.id, data.weight, data.reps);
  },
};
