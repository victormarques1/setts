import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateExerciseInput } from "@/modules/exercises/validations/exercise.schema";

export const exerciseRepository = {
  findByWorkoutId(workoutId: string) {
    return prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { name: "asc" },
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

  findById(id: string) {
    return prisma.exercise.findUnique({
      where: { id },
    });
  },

  findByIdForUser(exerciseId: string, userId: string) {
    return prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        workout: { userId },
      },
    });
  },

  findByUserId(userId: string) {
    return prisma.exercise.findMany({
      where: { workout: { userId } },
      orderBy: [{ workout: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        workout: {
          select: { name: true },
        },
      },
    });
  },

  findByIdForWorkout(exerciseId: string, workoutId: string) {
    return prisma.exercise.findFirst({
      where: { id: exerciseId, workoutId },
    });
  },

  create(data: CreateExerciseInput) {
    return prisma.exercise.create({ data });
  },

  update(id: string, name: string) {
    return prisma.exercise.update({
      where: { id },
      data: { name },
    });
  },

  delete(id: string) {
    return prisma.exercise.delete({
      where: { id },
    });
  },
};
