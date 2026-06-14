import {
  progressRepository,
  type ExerciseProgressPoint,
} from "@/modules/progress/repositories/progress.repository";
import { exerciseProgressSchema } from "@/modules/progress/validations/progress.schema";

export type { ExerciseProgressPoint };

export const progressService = {
  getExerciseProgress(exerciseId: string): Promise<ExerciseProgressPoint[]> {
    exerciseProgressSchema.parse({ exerciseId });
    return progressRepository.getExerciseProgress(exerciseId);
  },
};
