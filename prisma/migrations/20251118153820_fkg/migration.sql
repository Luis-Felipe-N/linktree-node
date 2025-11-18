/*
  Warnings:

  - You are about to drop the column `color` on the `backgrounds` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `fontFamily` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `fontWeight` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `shadowColor` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `shadowStyle` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `buttons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "backgrounds" DROP COLUMN "color",
ADD COLUMN     "className" TEXT,
ADD COLUMN     "noise" BOOLEAN DEFAULT false,
ADD COLUMN     "properties" JSONB;

-- AlterTable
ALTER TABLE "buttons" DROP COLUMN "color",
DROP COLUMN "fontFamily",
DROP COLUMN "fontWeight",
DROP COLUMN "shadowColor",
DROP COLUMN "shadowStyle",
DROP COLUMN "textColor",
ADD COLUMN     "className" TEXT,
ADD COLUMN     "properties" JSONB;

-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "editable" BOOLEAN DEFAULT true,
ADD COLUMN     "footer" JSONB,
ADD COLUMN     "heading" JSONB,
ADD COLUMN     "key" TEXT,
ADD COLUMN     "luminance" TEXT,
ADD COLUMN     "socialStyle" JSONB,
ADD COLUMN     "typeface" JSONB;
