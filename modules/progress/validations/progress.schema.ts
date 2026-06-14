import { z } from "zod";

export const exerciseProgressSchema = z.object({
  exerciseId: z.string().min(1),
});

export type ExerciseProgressInput = z.infer<typeof exerciseProgressSchema>;
