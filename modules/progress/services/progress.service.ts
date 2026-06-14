import { progressRepository } from "@/modules/progress/repositories/progress.repository";
import {
  progressQuerySchema,
  type ProgressQueryInput,
} from "@/modules/progress/validations/progress.schema";

export type ProgressDataPoint = {
  performedAt: Date;
  setNumber: number;
  weight: number;
  reps: number;
};

export const progressService = {
  getExerciseProgress(input: ProgressQueryInput): Promise<ProgressDataPoint[]> {
    const query = progressQuerySchema.parse(input);

    return progressRepository.findSetRecordsByExercise(query).then((records) =>
      records.map((record) => ({
        performedAt: record.session.performedAt,
        setNumber: record.setNumber,
        weight: record.weight,
        reps: record.reps,
      })),
    );
  },
};
