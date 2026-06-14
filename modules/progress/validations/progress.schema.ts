import { z } from "zod";

export const progressQuerySchema = z.object({
  exerciseId: z.string().min(1),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ProgressQueryInput = z.infer<typeof progressQuerySchema>;
