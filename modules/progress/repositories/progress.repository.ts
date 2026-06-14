import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type ExerciseProgressPoint = {
  date: string;
  weight: number;
};

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const progressRepository = {
  async getExerciseProgress(
    exerciseId: string,
  ): Promise<ExerciseProgressPoint[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        setRecords: {
          some: { exerciseId },
        },
        status: WorkoutSessionStatus.COMPLETED,
        performedAt: { not: null },
      },
      include: {
        setRecords: {
          where: { exerciseId },
          select: { weight: true },
        },
      },
      orderBy: { performedAt: "asc" },
    });

    return sessions.flatMap((session) => {
      if (!session.performedAt || session.setRecords.length === 0) {
        return [];
      }

      const maxWeight = Math.max(
        ...session.setRecords.map((record) => record.weight),
      );

      return [
        {
          date: formatDateOnly(session.performedAt),
          weight: maxWeight,
        },
      ];
    });
  },
};
