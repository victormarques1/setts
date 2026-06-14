import bcrypt from "bcrypt";

import { authRepository } from "@/modules/auth/repositories/auth.repository";
import type { AuthUser } from "@/modules/auth/types/auth.types";
import { loginSchema } from "@/modules/auth/validations/login.schema";

export const loginService = {
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const data = loginSchema.parse({ email, password });

    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
};
