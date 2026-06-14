-- CreateEnum
CREATE TYPE "WorkoutSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "WorkoutSession" ADD COLUMN "status" "WorkoutSessionStatus" NOT NULL DEFAULT 'COMPLETED';

ALTER TABLE "WorkoutSession" ALTER COLUMN "performedAt" DROP DEFAULT;
ALTER TABLE "WorkoutSession" ALTER COLUMN "performedAt" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "WorkoutSession_workoutId_status_idx" ON "WorkoutSession"("workoutId", "status");
