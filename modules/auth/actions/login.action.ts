"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import {
  actionError,
  type ActionResult,
} from "@/lib/action-result";
import { signIn } from "@/lib/auth";
import { loginFormSchema, type LoginFormInput } from "@/modules/auth/validations/login.schema";

export async function loginAction(
  input: LoginFormInput,
  callbackUrl = "/workouts",
): Promise<ActionResult<null>> {
  try {
    const data = loginFormSchema.parse(input);

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: callbackUrl,
    });

    return { success: true, data: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    if (error instanceof AuthError) {
      return actionError("Email ou senha inválidos.");
    }

    if (isRedirectError(error)) {
      throw error;
    }

    return actionError("Não foi possível entrar.");
  }
}
