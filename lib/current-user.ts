import { auth } from "@/lib/auth";

export async function getCurrentUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  return session.user.id;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
