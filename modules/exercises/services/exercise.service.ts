import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import {
  createExerciseSchema,
  updateExerciseSchema,
  type CreateExerciseInput,
  type UpdateExerciseInput,
} from "@/modules/exercises/validations/exercise.schema";

export const exerciseService = {
  listByWorkoutId(workoutId: string) {
    return exerciseRepository.findByWorkoutId(workoutId);
  },

  getById(id: string) {
    return exerciseRepository.findById(id);
  },

  create(input: CreateExerciseInput) {
    const data = createExerciseSchema.parse(input);
    return exerciseRepository.create(data);
  },

  update(input: UpdateExerciseInput) {
    const data = updateExerciseSchema.parse(input);
    return exerciseRepository.update(data.id, data.name);
  },

  delete(id: string) {
    return exerciseRepository.delete(id);
  },
};
