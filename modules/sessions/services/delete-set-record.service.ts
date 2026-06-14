import { setRecordRepository } from "@/modules/sessions/repositories/set-record.repository";
import { SetRecordNotFoundError } from "@/modules/sessions/services/update-set-record.service";
import {
  deleteSetRecordSchema,
  type DeleteSetRecordInput,
} from "@/modules/sessions/validations/session.schema";

export const deleteSetRecordService = {
  async delete(
    input: DeleteSetRecordInput,
    userId: string,
    workoutId: string,
    sessionId: string,
    exerciseId: string,
  ) {
    const data = deleteSetRecordSchema.parse(input);

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

    return setRecordRepository.delete(data.id);
  },
};
