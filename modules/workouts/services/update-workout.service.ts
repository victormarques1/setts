import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";
import {
  updateWorkoutSchema,
  type UpdateWorkoutInput,
} from "@/modules/workouts/validations/workout.schema";

export const updateWorkoutService = {
  async update(input: UpdateWorkoutInput, userId: string) {
    const data = updateWorkoutSchema.parse(input);

    const workout = await workoutRepository.findByIdForUser(data.id, userId);

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    return workoutRepository.update(data.id, data.name);
  },
};
