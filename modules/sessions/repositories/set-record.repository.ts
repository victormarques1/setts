import { prisma } from "@/lib/prisma";

export const setRecordRepository = {
  findByIdForUserContext(
    id: string,
    userId: string,
    workoutId: string,
    sessionId: string,
    exerciseId: string,
  ) {
    return prisma.setRecord.findFirst({
      where: {
        id,
        sessionId,
        exerciseId,
        session: {
          workoutId,
          workout: { userId, deletedAt: null },
        },
      },
    });
  },

  update(id: string, weight: number, reps: number) {
    return prisma.setRecord.update({
      where: { id },
      data: { weight, reps },
    });
  },

  delete(id: string) {
    return prisma.setRecord.delete({
      where: { id },
    });
  },
};
