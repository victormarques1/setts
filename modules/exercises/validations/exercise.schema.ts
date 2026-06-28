import { z } from "zod";

const exerciseNameField = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório.");

export const updateExerciseFormSchema = z.object({
  name: exerciseNameField
    .min(2, "Nome deve ter no mínimo 2 caracteres.")
    .max(60, "Nome deve ter no máximo 60 caracteres."),
});

export const updateExerciseSchema = updateExerciseFormSchema.extend({
  id: z.string().min(1),
});

export const deleteExerciseSchema = z.object({
  id: z.string().min(1),
});

export type UpdateExerciseFormInput = z.infer<typeof updateExerciseFormSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type DeleteExerciseInput = z.infer<typeof deleteExerciseSchema>;
