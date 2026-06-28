-- CreateTable
CREATE TABLE "ExerciseCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExerciseCatalog_isPublic_idx" ON "ExerciseCatalog"("isPublic");

-- CreateIndex
CREATE INDEX "ExerciseCatalog_createdByUserId_idx" ON "ExerciseCatalog"("createdByUserId");

-- CreateIndex
CREATE INDEX "ExerciseCatalog_name_idx" ON "ExerciseCatalog"("name");

-- AddForeignKey
ALTER TABLE "ExerciseCatalog" ADD CONSTRAINT "ExerciseCatalog_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddColumn
ALTER TABLE "Exercise" ADD COLUMN "exerciseCatalogId" TEXT;

-- Migrate existing exercises into user catalog entries (deduplicated by user + normalized name)
INSERT INTO "ExerciseCatalog" ("id", "name", "isPublic", "createdByUserId", "createdAt")
SELECT
    'ec_' || substr(md5(w."userId" || ':' || lower(trim(e."name"))), 1, 24),
    min(trim(e."name")),
    false,
    w."userId",
    min(e."createdAt")
FROM "Exercise" e
INNER JOIN "Workout" w ON w."id" = e."workoutId"
GROUP BY w."userId", lower(trim(e."name"));

-- Link exercises to their catalog entries
UPDATE "Exercise" e
SET "exerciseCatalogId" = mapping."catalogId"
FROM (
    SELECT
        ex."id" AS "exerciseId",
        ec."id" AS "catalogId"
    FROM "Exercise" ex
    INNER JOIN "Workout" w ON w."id" = ex."workoutId"
    INNER JOIN "ExerciseCatalog" ec
        ON ec."createdByUserId" = w."userId"
        AND lower(ec."name") = lower(trim(ex."name"))
) AS mapping
WHERE e."id" = mapping."exerciseId";

-- DropColumn
ALTER TABLE "Exercise" DROP COLUMN "name";

-- Make exerciseCatalogId required
ALTER TABLE "Exercise" ALTER COLUMN "exerciseCatalogId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Exercise_exerciseCatalogId_idx" ON "Exercise"("exerciseCatalogId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_workoutId_exerciseCatalogId_key" ON "Exercise"("workoutId", "exerciseCatalogId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exerciseCatalogId_fkey" FOREIGN KEY ("exerciseCatalogId") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
