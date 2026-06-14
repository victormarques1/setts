import bcrypt from "bcrypt";

import { authRepository } from "@/modules/auth/repositories/auth.repository";
import {
  registerSchema,
  type RegisterFormInput,
} from "@/modules/auth/validations/register.schema";

const BCRYPT_ROUNDS = 12;

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este email já está cadastrado.");
    this.name = "EmailAlreadyExistsError";
  }
}

export const registerService = {
  async register(input: RegisterFormInput) {
    const data = registerSchema.parse(input);

    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    return authRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });
  },
};
