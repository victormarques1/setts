import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  type CreateWorkoutInput,
  type UpdateWorkoutInput,
} from "@/modules/workouts/validations/workout.schema";

export const workoutService = {
  listByUserId(userId: string) {
    return workoutRepository.findByUserId(userId);
  },

  getById(id: string) {
    return workoutRepository.findById(id);
  },

  getByIdForUser(id: string, userId: string) {
    return workoutRepository.findByIdForUser(id, userId);
  },

  create(input: CreateWorkoutInput) {
    const data = createWorkoutSchema.parse(input);
    return workoutRepository.create(data);
  },

  update(input: UpdateWorkoutInput) {
    const data = updateWorkoutSchema.parse(input);
    return workoutRepository.update(data.id, data.name);
  },

  delete(id: string) {
    return workoutRepository.delete(id);
  },
};
