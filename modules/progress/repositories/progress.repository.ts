import { prisma } from "@/lib/prisma";
import type { ProgressQueryInput } from "@/modules/progress/validations/progress.schema";

export const progressRepository = {
  findSetRecordsByExercise(input: ProgressQueryInput) {
    const { exerciseId, from, to } = input;

    return prisma.setRecord.findMany({
      where: {
        exerciseId,
        session: {
          performedAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        },
      },
      include: {
        session: {
          select: { performedAt: true },
        },
      },
      orderBy: {
        session: { performedAt: "asc" },
      },
    });
  },
};
