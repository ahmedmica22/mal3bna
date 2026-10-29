-- AlterEnum
ALTER TYPE "FilePurpose" ADD VALUE IF NOT EXISTS 'court_photo';

-- AlterTable
ALTER TABLE "Court" ADD COLUMN IF NOT EXISTS "approval_status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "Court" ADD COLUMN IF NOT EXISTS "rejection_reason" TEXT;
ALTER TABLE "Court" ALTER COLUMN "is_active" SET DEFAULT false;

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourtPhoto" (
    "courtId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "CourtPhoto_pkey" PRIMARY KEY ("courtId","fileId")
);

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'CourtPhoto_courtId_fkey'
    ) THEN
        ALTER TABLE "CourtPhoto" ADD CONSTRAINT "CourtPhoto_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'CourtPhoto_fileId_fkey'
    ) THEN
        ALTER TABLE "CourtPhoto" ADD CONSTRAINT "CourtPhoto_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Court_venueId_approval_status_idx" ON "Court"("venueId", "approval_status");

-- For existing courts, mark them approved and active
UPDATE "Court" SET "approval_status" = 'approved', "is_active" = true WHERE "approval_status" = 'pending';
