import { z } from "zod";

export const createExerciseSchema = z.object({
  workoutId: z.string().min(1),
  name: z.string().min(1).max(100),
});

export const updateExerciseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
