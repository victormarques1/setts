import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import { progressRepository } from "@/modules/progress/repositories/progress.repository";
import { exerciseProgressSchema } from "@/modules/progress/validations/progress.schema";

export class ExerciseNotFoundError extends Error {
  constructor() {
    super("Exercício não encontrado.");
    this.name = "ExerciseNotFoundError";
  }
}

export type ExerciseProgressHistoryPoint = {
  date: string;
  weight: number;
};

export type ExerciseProgressView = {
  exerciseName: string;
  history: ExerciseProgressHistoryPoint[];
};

export const progressService = {
  async getExerciseProgress(exerciseId: string): Promise<ExerciseProgressView> {
    exerciseProgressSchema.parse({ exerciseId });

    const exercise = await exerciseRepository.findById(exerciseId);

    if (!exercise) {
      throw new ExerciseNotFoundError();
    }

    const history = await progressRepository.getExerciseProgress(exerciseId);

    return {
      exerciseName: exercise.name,
      history,
    };
  },
};
