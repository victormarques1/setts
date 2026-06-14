import { z } from "zod";

export const createWorkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(100, "Nome deve ter no máximo 100 caracteres."),
});

export const createWorkoutSchema = createWorkoutFormSchema.extend({
  userId: z.string().min(1),
});

export const updateWorkoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
});

export type CreateWorkoutFormInput = z.infer<typeof createWorkoutFormSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
