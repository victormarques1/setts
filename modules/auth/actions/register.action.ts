"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { signIn } from "@/lib/auth";
import {
  EmailAlreadyExistsError,
  registerService,
} from "@/modules/auth/services/register.service";
import type { SafeUser } from "@/modules/auth/types/auth.types";
import type { RegisterFormInput } from "@/modules/auth/validations/register.schema";

export async function registerAction(
  input: RegisterFormInput,
): Promise<ActionResult<SafeUser>> {
  try {
    const user = await registerService.register(input);

    await signIn("credentials", {
      email: user.email,
      password: input.password,
      redirectTo: "/workouts",
    });

    return actionSuccess({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.issues[0]?.message ?? "Dados inválidos.");
    }

    if (error instanceof EmailAlreadyExistsError) {
      return actionError(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return actionError("Este email já está cadastrado.");
      }
    }

    if (error instanceof AuthError) {
      return actionError("Não foi possível entrar após o cadastro.");
    }

    if (isRedirectError(error)) {
      throw error;
    }

    return actionError("Não foi possível criar a conta.");
  }
}
