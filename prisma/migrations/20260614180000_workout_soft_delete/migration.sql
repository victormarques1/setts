-- AlterTable
ALTER TABLE "Workout" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Workout_userId_deletedAt_idx" ON "Workout"("userId", "deletedAt");
