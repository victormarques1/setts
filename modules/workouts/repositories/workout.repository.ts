import { prisma } from "@/lib/prisma";
import type { CreateWorkoutInput } from "@/modules/workouts/validations/workout.schema";

export const workoutRepository = {
  findByUserId(userId: string) {
    return prisma.workout.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.workout.findUnique({
      where: { id },
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
    return prisma.workout.delete({
      where: { id },
    });
  },
};
