import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import { exerciseCatalogRepository } from "@/modules/exercises/repositories/exercise-catalog.repository";
import {
  ExerciseCatalogDuplicateError,
  WorkoutNotFoundError,
} from "@/modules/exercises/services/exercise.service";
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

export class ExerciseNotEditableError extends Error {
  constructor() {
    super("Exercícios do catálogo padrão não podem ser editados.");
    this.name = "ExerciseNotEditableError";
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

    if (!exercise.isCustom) {
      throw new ExerciseNotEditableError();
    }

    const duplicate = await exerciseCatalogRepository.findCustomByNameForUser(
      data.name,
      userId,
    );

    if (duplicate && duplicate.id !== exercise.exerciseCatalogId) {
      throw new ExerciseCatalogDuplicateError();
    }

    await exerciseCatalogRepository.update(exercise.exerciseCatalogId, {
      name: data.name,
    });

    return exerciseRepository.findByIdForWorkout(data.id, workoutId);
  },
};
