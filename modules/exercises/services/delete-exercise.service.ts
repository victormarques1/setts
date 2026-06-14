import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import { ExerciseNotFoundError } from "@/modules/exercises/services/update-exercise.service";
import {
  deleteExerciseSchema,
  type DeleteExerciseInput,
} from "@/modules/exercises/validations/exercise.schema";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";

export const deleteExerciseService = {
  async delete(
    input: DeleteExerciseInput,
    userId: string,
    workoutId: string,
  ) {
    const data = deleteExerciseSchema.parse(input);

    const workout = await workoutRepository.findByIdForUser(workoutId, userId);

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    const exercise = await exerciseRepository.findByIdForWorkout(
      data.id,
      workoutId,
    );

    if (!exercise) {
      throw new ExerciseNotFoundError();
    }

    return exerciseRepository.delete(data.id);
  },
};
