import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateSessionInput,
  CreateSetRecordInput,
} from "@/modules/sessions/validations/session.schema";

export const sessionRepository = {
  findByWorkoutId(workoutId: string) {
    return prisma.workoutSession.findMany({
      where: { workoutId },
      orderBy: { performedAt: "desc" },
      include: { setRecords: true },
    });
  },

  findById(id: string) {
    return prisma.workoutSession.findUnique({
      where: { id },
      include: { setRecords: true },
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.workoutSession.findFirst({
      where: {
        id,
        workout: { userId },
      },
      include: { setRecords: true },
    });
  },

  findActiveByWorkoutIdForUser(workoutId: string, userId: string) {
    return prisma.workoutSession.findFirst({
      where: {
        workoutId,
        status: WorkoutSessionStatus.IN_PROGRESS,
        workout: { userId },
      },
      include: { setRecords: true },
    });
  },

  findCompletedByUserId(userId: string) {
    return prisma.workoutSession.findMany({
      where: {
        status: WorkoutSessionStatus.COMPLETED,
        performedAt: { not: null },
        workout: { userId },
      },
      include: {
        workout: {
          select: { id: true, name: true },
        },
      },
      orderBy: { performedAt: "desc" },
    });
  },

  create(data: CreateSessionInput) {
    return prisma.workoutSession.create({
      data: {
        workoutId: data.workoutId,
        status: WorkoutSessionStatus.IN_PROGRESS,
      },
    });
  },

  complete(id: string, performedAt: Date) {
    return prisma.workoutSession.update({
      where: { id },
      data: {
        status: WorkoutSessionStatus.COMPLETED,
        performedAt,
      },
      include: { setRecords: true },
    });
  },

  findSetRecordsBySessionAndExercise(sessionId: string, exerciseId: string) {
    return prisma.setRecord.findMany({
      where: { sessionId, exerciseId },
      orderBy: { setNumber: "asc" },
    });
  },

  findMaxSetNumber(sessionId: string, exerciseId: string) {
    return prisma.setRecord.aggregate({
      where: { sessionId, exerciseId },
      _max: { setNumber: true },
    });
  },

  createSetRecord(data: CreateSetRecordInput) {
    return prisma.setRecord.create({ data });
  },
};
