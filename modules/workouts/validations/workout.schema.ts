import { z } from "zod";

const workoutNameField = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório.");

export const createWorkoutFormSchema = z.object({
  name: workoutNameField.max(
    100,
    "Nome deve ter no máximo 100 caracteres.",
  ),
});

export const createWorkoutSchema = createWorkoutFormSchema.extend({
  userId: z.string().min(1),
});

export const updateWorkoutFormSchema = z.object({
  name: workoutNameField
    .min(3, "Nome deve ter no mínimo 3 caracteres.")
    .max(50, "Nome deve ter no máximo 50 caracteres."),
});

export const updateWorkoutSchema = updateWorkoutFormSchema.extend({
  id: z.string().min(1),
});

export const deleteWorkoutSchema = z.object({
  id: z.string().min(1),
});

export type CreateWorkoutFormInput = z.infer<typeof createWorkoutFormSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutFormInput = z.infer<typeof updateWorkoutFormSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type DeleteWorkoutInput = z.infer<typeof deleteWorkoutSchema>;
