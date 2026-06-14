-- Rename IN_PROGRESS to ACTIVE
ALTER TYPE "WorkoutSessionStatus" RENAME VALUE 'IN_PROGRESS' TO 'ACTIVE';

-- Add CANCELED status
ALTER TYPE "WorkoutSessionStatus" ADD VALUE 'CANCELED';

-- Add canceledAt column
ALTER TABLE "WorkoutSession" ADD COLUMN "canceledAt" TIMESTAMP(3);

-- Update default status
ALTER TABLE "WorkoutSession" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
