import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import {
  createExerciseSchema,
  updateExerciseSchema,
  type CreateExerciseInput,
  type UpdateExerciseInput,
} from "@/modules/exercises/validations/exercise.schema";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";

export class WorkoutNotFoundError extends Error {
  constructor() {
    super("Treino não encontrado.");
    this.name = "WorkoutNotFoundError";
  }
}

export type UserExerciseSummary = {
  id: string;
  name: string;
  workoutName: string;
};

export const exerciseService = {
  async listByUserId(userId: string): Promise<UserExerciseSummary[]> {
    const exercises = await exerciseRepository.findByUserId(userId);

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      workoutName: exercise.workout.name,
    }));
  },

  listByWorkoutId(workoutId: string) {
    return exerciseRepository.findByWorkoutId(workoutId);
  },

  getById(id: string) {
    return exerciseRepository.findById(id);
  },

  getByIdForWorkout(exerciseId: string, workoutId: string) {
    return exerciseRepository.findByIdForWorkout(exerciseId, workoutId);
  },

  async create(input: CreateExerciseInput, userId: string) {
    const data = createExerciseSchema.parse(input);
    const workout = await workoutRepository.findByIdForUser(
      data.workoutId,
      userId,
    );

    if (!workout) {
      throw new WorkoutNotFoundError();
    }

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
