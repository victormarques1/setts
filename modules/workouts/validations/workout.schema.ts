import { z } from "zod";

export const createWorkoutSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
});

export const updateWorkoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
