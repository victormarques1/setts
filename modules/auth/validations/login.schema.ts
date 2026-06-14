import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório.")
    .email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const loginSchema = loginFormSchema;

export type LoginFormInput = z.infer<typeof loginFormSchema>;
