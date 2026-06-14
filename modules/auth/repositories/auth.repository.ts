import { prisma } from "@/lib/prisma";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(data: CreateUserData) {
    return prisma.user.create({ data });
  },
};
