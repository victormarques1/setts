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

  create(data: CreateSessionInput) {
    return prisma.workoutSession.create({ data });
  },

  createSetRecord(data: CreateSetRecordInput) {
    return prisma.setRecord.create({ data });
  },
};
