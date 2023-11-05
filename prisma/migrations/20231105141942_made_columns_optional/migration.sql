-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_backgroundId_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_buttonId_fkey";

-- AlterTable
ALTER TABLE "themes" ALTER COLUMN "backgroundId" DROP NOT NULL,
ALTER COLUMN "buttonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "backgrounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_buttonId_fkey" FOREIGN KEY ("buttonId") REFERENCES "buttons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
