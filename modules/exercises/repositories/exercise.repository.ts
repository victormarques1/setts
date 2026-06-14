import { prisma } from "@/lib/prisma";
import type { CreateExerciseInput } from "@/modules/exercises/validations/exercise.schema";

export const exerciseRepository = {
  findByWorkoutId(workoutId: string) {
    return prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.exercise.findUnique({
      where: { id },
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
