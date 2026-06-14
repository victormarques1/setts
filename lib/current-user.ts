import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@weightzz.local";

export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      name: "Demo",
      email: DEMO_USER_EMAIL,
    },
  });

  return user.id;
}
