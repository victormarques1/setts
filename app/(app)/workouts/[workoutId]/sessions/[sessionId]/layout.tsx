import { WorkoutSessionStatus } from "@/app/generated/prisma/client";
import { AppChromeSetter } from "@/components/layout/app-chrome-setter";
import { getCurrentUserId } from "@/lib/current-user";
import { getCachedSessionForUser } from "@/lib/cached-session";

type SessionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workoutId: string; sessionId: string }>;
};

export default async function SessionLayout({
  children,
  params,
}: SessionLayoutProps) {
  const { workoutId, sessionId } = await params;
  const userId = await getCurrentUserId();
  const session = await getCachedSessionForUser(sessionId, userId);
  const hideBottomNav =
    session?.workoutId === workoutId &&
    session.status === WorkoutSessionStatus.ACTIVE;

  return (
    <AppChromeSetter hideBottomNav={hideBottomNav}>{children}</AppChromeSetter>
  );
}
