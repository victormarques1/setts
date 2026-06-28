import { buildExerciseLoadSummaries } from "@/modules/exercises/lib/build-exercise-load-summaries";
import {
  exerciseRepository,
  type WorkoutExercise,
} from "@/modules/exercises/repositories/exercise.repository";
import {
  exerciseCatalogService,
  ExerciseCatalogDuplicateError,
} from "@/modules/exercises/services/exercise-catalog.service";
import {
  addExerciseToWorkoutSchema,
  createCustomExerciseSchema,
  type AddExerciseToWorkoutInput,
  type CreateCustomExerciseInput,
} from "@/modules/exercises/validations/exercise-catalog.schema";
import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";

export class WorkoutNotFoundError extends Error {
  constructor() {
    super("Treino não encontrado.");
    this.name = "WorkoutNotFoundError";
  }
}

export class ExerciseAlreadyInWorkoutError extends Error {
  constructor() {
    super("Este exercício já foi adicionado ao treino.");
    this.name = "ExerciseAlreadyInWorkoutError";
  }
}

export class ExerciseCatalogNotFoundError extends Error {
  constructor() {
    super("Exercício não encontrado.");
    this.name = "ExerciseCatalogNotFoundError";
  }
}

export {
  ExerciseCatalogDuplicateError,
};

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
  muscleGroup: string | null;
  isCustom: boolean;
  lastLoad: {
    weight: number;
    reps: number;
  } | null;
};

async function assertWorkoutOwnership(workoutId: string, userId: string) {
  const workout = await workoutRepository.findByIdForUser(workoutId, userId);

  if (!workout) {
    throw new WorkoutNotFoundError();
  }

  return workout;
}

async function createWorkoutExercise(
  workoutId: string,
  exerciseCatalogId: string,
): Promise<WorkoutExercise> {
  const created = await exerciseRepository.create(workoutId, exerciseCatalogId);

  return {
    id: created.id,
    workoutId: created.workoutId,
    exerciseCatalogId: created.exerciseCatalogId,
    createdAt: created.createdAt,
    name: created.catalog.name,
    muscleGroup: created.catalog.muscleGroup,
    isPublic: created.catalog.isPublic,
    isCustom: !created.catalog.isPublic,
  };
}

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
        name: exercise.catalog.name,
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
      muscleGroup: exercise.muscleGroup,
      isCustom: exercise.isCustom,
      lastLoad: lastLoadByExerciseId.get(exercise.id) ?? null,
    }));
  },

  getById(id: string) {
    return exerciseRepository.findById(id);
  },

  getByIdForWorkout(exerciseId: string, workoutId: string) {
    return exerciseRepository.findByIdForWorkout(exerciseId, workoutId);
  },

  async getCatalogIdsInWorkout(workoutId: string) {
    const exercises = await exerciseRepository.findCatalogIdsByWorkoutId(
      workoutId,
    );

    return exercises.map((exercise) => exercise.exerciseCatalogId);
  },

  async addFromCatalog(input: AddExerciseToWorkoutInput, userId: string) {
    const data = addExerciseToWorkoutSchema.parse(input);
    await assertWorkoutOwnership(data.workoutId, userId);

    const catalogItem = await exerciseCatalogService.getAccessibleById(
      data.exerciseCatalogId,
      userId,
    );

    if (!catalogItem) {
      throw new ExerciseCatalogNotFoundError();
    }

    const existing = await exerciseRepository.findByWorkoutAndCatalogId(
      data.workoutId,
      data.exerciseCatalogId,
    );

    if (existing) {
      throw new ExerciseAlreadyInWorkoutError();
    }

    return createWorkoutExercise(data.workoutId, data.exerciseCatalogId);
  },

  async createCustomAndAdd(input: CreateCustomExerciseInput, userId: string) {
    const data = createCustomExerciseSchema.parse(input);
    await assertWorkoutOwnership(data.workoutId, userId);

    const catalogItem = await exerciseCatalogService.createCustom(
      {
        name: data.name,
        muscleGroup: data.muscleGroup,
        workoutId: data.workoutId,
      },
      userId,
    );

    return createWorkoutExercise(data.workoutId, catalogItem.id);
  },
};
