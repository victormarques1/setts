import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const exerciseWithCatalogSelect = {
  id: true,
  workoutId: true,
  exerciseCatalogId: true,
  createdAt: true,
  catalog: {
    select: {
      name: true,
      muscleGroup: true,
      isPublic: true,
      createdByUserId: true,
    },
  },
} as const;

export type ExerciseWithCatalog = {
  id: string;
  workoutId: string;
  exerciseCatalogId: string;
  createdAt: Date;
  catalog: {
    name: string;
    muscleGroup: string | null;
    isPublic: boolean;
    createdByUserId: string | null;
  };
};

function mapExerciseWithCatalog(
  exercise: ExerciseWithCatalog,
) {
  return {
    id: exercise.id,
    workoutId: exercise.workoutId,
    exerciseCatalogId: exercise.exerciseCatalogId,
    createdAt: exercise.createdAt,
    name: exercise.catalog.name,
    muscleGroup: exercise.catalog.muscleGroup,
    isPublic: exercise.catalog.isPublic,
    isCustom: !exercise.catalog.isPublic,
  };
}

export type WorkoutExercise = ReturnType<typeof mapExerciseWithCatalog>;

export const exerciseRepository = {
  async findByWorkoutId(workoutId: string): Promise<WorkoutExercise[]> {
    const exercises = await prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { createdAt: "asc" },
      select: exerciseWithCatalogSelect,
    });

    return exercises.map(mapExerciseWithCatalog);
  },

  findCatalogIdsByWorkoutId(workoutId: string) {
    return prisma.exercise.findMany({
      where: { workoutId },
      select: { exerciseCatalogId: true },
    });
  },

  findLastSetRecordsByWorkoutId(workoutId: string) {
    return prisma.setRecord.findMany({
      where: {
        exercise: { workoutId },
        session: {
          status: WorkoutSessionStatus.COMPLETED,
          performedAt: { not: null },
        },
      },
      orderBy: [
        { session: { performedAt: "desc" } },
        { setNumber: "desc" },
      ],
      select: {
        exerciseId: true,
        weight: true,
        reps: true,
      },
    });
  },

  async findById(id: string): Promise<WorkoutExercise | null> {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      select: exerciseWithCatalogSelect,
    });

    return exercise ? mapExerciseWithCatalog(exercise) : null;
  },

  async findByIdForUser(
    exerciseId: string,
    userId: string,
  ): Promise<WorkoutExercise | null> {
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        workout: { userId, deletedAt: null },
      },
      select: exerciseWithCatalogSelect,
    });

    return exercise ? mapExerciseWithCatalog(exercise) : null;
  },

  findByUserId(userId: string) {
    return prisma.exercise.findMany({
      where: { workout: { userId, deletedAt: null } },
      orderBy: [{ workout: { name: "asc" } }, { catalog: { name: "asc" } }],
      select: {
        id: true,
        catalog: {
          select: { name: true },
        },
        workout: {
          select: { name: true },
        },
      },
    });
  },

  findRecentSetRecordsByUserId(userId: string) {
    return prisma.setRecord.findMany({
      where: {
        exercise: { workout: { userId, deletedAt: null } },
        session: {
          status: WorkoutSessionStatus.COMPLETED,
          performedAt: { not: null },
        },
      },
      orderBy: [
        { session: { performedAt: "desc" } },
        { setNumber: "desc" },
      ],
      select: {
        exerciseId: true,
        weight: true,
        reps: true,
        sessionId: true,
        session: {
          select: { performedAt: true },
        },
      },
    });
  },

  async findByIdForWorkout(
    exerciseId: string,
    workoutId: string,
  ): Promise<WorkoutExercise | null> {
    const exercise = await prisma.exercise.findFirst({
      where: { id: exerciseId, workoutId },
      select: exerciseWithCatalogSelect,
    });

    return exercise ? mapExerciseWithCatalog(exercise) : null;
  },

  findByWorkoutAndCatalogId(workoutId: string, exerciseCatalogId: string) {
    return prisma.exercise.findUnique({
      where: {
        workoutId_exerciseCatalogId: {
          workoutId,
          exerciseCatalogId,
        },
      },
    });
  },

  create(workoutId: string, exerciseCatalogId: string) {
    return prisma.exercise.create({
      data: {
        workoutId,
        exerciseCatalogId,
      },
      select: exerciseWithCatalogSelect,
    });
  },

  delete(id: string) {
    return prisma.exercise.delete({
      where: { id },
    });
  },
};
