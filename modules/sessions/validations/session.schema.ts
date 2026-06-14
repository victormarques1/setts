import { z } from "zod";

export const createSessionSchema = z.object({
  workoutId: z.string().min(1),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export const createSetRecordFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Peso é obrigatório." })
    .min(0, "Peso deve ser zero ou maior."),
  reps: z.coerce
    .number({ error: "Repetições são obrigatórias." })
    .int("Repetições devem ser um número inteiro.")
    .min(1, "Repetições devem ser pelo menos 1."),
});

export const createSetRecordSchema = createSetRecordFormSchema.extend({
  sessionId: z.string().min(1),
  exerciseId: z.string().min(1),
  setNumber: z.number().int().min(1),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type CreateSetRecordFormInput = z.input<typeof createSetRecordFormSchema>;
export type CreateSetRecordInput = z.infer<typeof createSetRecordSchema>;
