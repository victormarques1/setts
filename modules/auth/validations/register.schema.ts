import { z } from "zod";

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(100, "Nome deve ter no máximo 100 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório.")
    .email("Email inválido."),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres."),
});

export const registerSchema = registerFormSchema;

export type RegisterFormInput = z.infer<typeof registerFormSchema>;
