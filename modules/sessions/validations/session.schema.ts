import { z } from "zod";

export const createSessionSchema = z.object({
  workoutId: z.string().min(1),
  performedAt: z.coerce.date().optional(),
});

export const createSetRecordSchema = z.object({
  sessionId: z.string().min(1),
  exerciseId: z.string().min(1),
  setNumber: z.number().int().min(1),
  weight: z.number().min(0),
  reps: z.number().int().min(1),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CreateSetRecordInput = z.infer<typeof createSetRecordSchema>;
