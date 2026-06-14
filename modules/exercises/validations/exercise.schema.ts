import { z } from "zod";

export const createExerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(100, "Nome deve ter no máximo 100 caracteres."),
});

export const createExerciseSchema = createExerciseFormSchema.extend({
  workoutId: z.string().min(1),
});

export const updateExerciseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
});

export type CreateExerciseFormInput = z.infer<typeof createExerciseFormSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
