import { z } from "zod";

const exerciseNameField = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório.")
  .max(100, "Nome deve ter no máximo 100 caracteres.");

export const searchExerciseCatalogSchema = z.object({
  query: z.string().trim().max(100),
});

export const createCustomExerciseFormSchema = z.object({
  name: exerciseNameField,
  muscleGroup: z
    .string()
    .trim()
    .max(50, "Grupo muscular deve ter no máximo 50 caracteres.")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export const createCustomExerciseSchema = createCustomExerciseFormSchema.extend({
  workoutId: z.string().min(1),
});

export const addExerciseToWorkoutSchema = z.object({
  workoutId: z.string().min(1),
  exerciseCatalogId: z.string().min(1),
});

export type SearchExerciseCatalogInput = z.infer<
  typeof searchExerciseCatalogSchema
>;
export type CreateCustomExerciseFormInput = z.infer<
  typeof createCustomExerciseFormSchema
>;
export type CreateCustomExerciseInput = z.infer<
  typeof createCustomExerciseSchema
>;
export type AddExerciseToWorkoutInput = z.infer<
  typeof addExerciseToWorkoutSchema
>;
