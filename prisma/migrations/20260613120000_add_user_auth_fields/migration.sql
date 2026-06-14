-- Legacy users had no password; reset before adding auth fields.
DELETE FROM "User";

ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL;
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL;
