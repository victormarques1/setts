-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "createdAt" TIMESTAMP(3);

-- Backfill existing rows preserving creation order via cuid id
WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "workoutId" ORDER BY id ASC) AS rn
  FROM "Exercise"
)
UPDATE "Exercise" e
SET "createdAt" = TIMESTAMP '1970-01-01 00:00:00' + (ordered.rn * INTERVAL '1 millisecond')
FROM ordered
WHERE e.id = ordered.id;

ALTER TABLE "Exercise" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "Exercise" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
