import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";
import {
  deleteWorkoutSchema,
  type DeleteWorkoutInput,
} from "@/modules/workouts/validations/workout.schema";

export const deleteWorkoutService = {
  async delete(input: DeleteWorkoutInput, userId: string) {
    const data = deleteWorkoutSchema.parse(input);

    const workout = await workoutRepository.findByIdForUser(data.id, userId);

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    return workoutRepository.delete(data.id);
  },
};
