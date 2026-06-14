import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateWorkoutInput } from "@/modules/workouts/validations/workout.schema";

const activeWorkoutFilter = {
  deletedAt: null,
} as const;

export const workoutRepository = {
  findByUserId(userId: string) {
    return prisma.workout.findMany({
      where: { userId, ...activeWorkoutFilter },
      orderBy: { name: "asc" },
    });
  },

  findSummariesByUserId(userId: string) {
    return prisma.workout.findMany({
      where: { userId, ...activeWorkoutFilter },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: { exercises: true },
        },
        sessions: {
          where: {
            status: WorkoutSessionStatus.COMPLETED,
            performedAt: { not: null },
          },
          orderBy: { performedAt: "desc" },
          take: 1,
          select: { performedAt: true },
        },
      },
    });
  },

  findById(id: string) {
    return prisma.workout.findFirst({
      where: { id, ...activeWorkoutFilter },
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.workout.findFirst({
      where: { id, userId, ...activeWorkoutFilter },
    });
  },

  create(data: CreateWorkoutInput) {
    return prisma.workout.create({ data });
  },

  update(id: string, name: string) {
    return prisma.workout.update({
      where: { id },
      data: { name },
    });
  },

  delete(id: string) {
    return prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
