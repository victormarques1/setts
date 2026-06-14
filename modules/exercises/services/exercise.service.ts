import { buildExerciseLoadSummaries } from "@/modules/exercises/lib/build-exercise-load-summaries";
import { exerciseRepository } from "@/modules/exercises/repositories/exercise.repository";
import {
  createExerciseSchema,
  type CreateExerciseInput,
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
  lastLoad: {
    weight: number;
    reps: number;
  } | null;
  trend: "up" | "down" | "same" | null;
};

export type ExerciseSummary = {
  id: string;
  name: string;
  lastLoad: {
    weight: number;
    reps: number;
  } | null;
};

export const exerciseService = {
  async listByUserId(userId: string): Promise<UserExerciseSummary[]> {
    const [exercises, setRecords] = await Promise.all([
      exerciseRepository.findByUserId(userId),
      exerciseRepository.findRecentSetRecordsByUserId(userId),
    ]);

    const loadSummaries = buildExerciseLoadSummaries(setRecords);

    return exercises.map((exercise) => {
      const summary = loadSummaries.get(exercise.id);

      return {
        id: exercise.id,
        name: exercise.name,
        workoutName: exercise.workout.name,
        lastLoad: summary?.lastLoad ?? null,
        trend: summary?.trend ?? null,
      };
    });
  },

  listByWorkoutId(workoutId: string) {
    return exerciseRepository.findByWorkoutId(workoutId);
  },

  async listSummariesByWorkoutId(workoutId: string): Promise<ExerciseSummary[]> {
    const [exercises, setRecords] = await Promise.all([
      exerciseRepository.findByWorkoutId(workoutId),
      exerciseRepository.findLastSetRecordsByWorkoutId(workoutId),
    ]);

    const lastLoadByExerciseId = new Map<
      string,
      { weight: number; reps: number }
    >();

    for (const record of setRecords) {
      if (!lastLoadByExerciseId.has(record.exerciseId)) {
        lastLoadByExerciseId.set(record.exerciseId, {
          weight: record.weight,
          reps: record.reps,
        });
      }
    }

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      lastLoad: lastLoadByExerciseId.get(exercise.id) ?? null,
    }));
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
};
