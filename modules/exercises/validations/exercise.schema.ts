import { z } from "zod";

const exerciseNameField = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório.");

export const createExerciseFormSchema = z.object({
  name: exerciseNameField.max(
    100,
    "Nome deve ter no máximo 100 caracteres.",
  ),
});

export const createExerciseSchema = createExerciseFormSchema.extend({
  workoutId: z.string().min(1),
});

export const updateExerciseFormSchema = z.object({
  name: exerciseNameField
    .min(2, "Nome deve ter no mínimo 2 caracteres.")
    .max(60, "Nome deve ter no máximo 60 caracteres."),
});

export const updateExerciseSchema = updateExerciseFormSchema.extend({
  id: z.string().min(1),
});

export type CreateExerciseFormInput = z.infer<typeof createExerciseFormSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseFormInput = z.infer<typeof updateExerciseFormSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
