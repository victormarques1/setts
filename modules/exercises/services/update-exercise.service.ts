import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import { WorkoutNotFoundError } from "@/modules/exercises/services/exercise.service";
import {
  updateExerciseSchema,
  type UpdateExerciseInput,
} from "@/modules/exercises/validations/exercise.schema";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";

export class ExerciseNotFoundError extends Error {
  constructor() {
    super("Exercício não encontrado.");
    this.name = "ExerciseNotFoundError";
  }
}

export const updateExerciseService = {
  async update(
    input: UpdateExerciseInput,
    userId: string,
    workoutId: string,
  ) {
    const data = updateExerciseSchema.parse(input);

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

    return exerciseRepository.update(data.id, data.name);
  },
};
