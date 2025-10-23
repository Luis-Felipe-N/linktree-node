/*
  Warnings:

  - You are about to drop the column `image` on the `backgrounds` table. All the data in the column will be lost.
  - You are about to drop the column `poster` on the `backgrounds` table. All the data in the column will be lost.
  - You are about to drop the column `text_color` on the `buttons` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `background_id` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `button_id` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `themes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pageId]` on the table `themes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `backgrounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textColor` to the `buttons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `links` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `links` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `themes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_userId_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_background_id_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_button_id_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_user_id_fkey";

-- AlterTable
ALTER TABLE "backgrounds" DROP COLUMN "image",
DROP COLUMN "poster",
ADD COLUMN     "gradientDirection" TEXT,
ADD COLUMN     "gradientEnd" TEXT,
ADD COLUMN     "gradientStart" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "buttons" DROP COLUMN "text_color",
ADD COLUMN     "fontFamily" TEXT,
ADD COLUMN     "fontWeight" TEXT,
ADD COLUMN     "shadowColor" TEXT,
ADD COLUMN     "shadowStyle" TEXT,
ADD COLUMN     "textColor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "links" DROP COLUMN "userId",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highlightEffect" TEXT,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pageId" TEXT NOT NULL,
ADD COLUMN     "scheduledEnd" TIMESTAMP(3),
ADD COLUMN     "scheduledStart" TIMESTAMP(3),
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'link',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "themes" DROP COLUMN "background_id",
DROP COLUMN "button_id",
DROP COLUMN "user_id",
ADD COLUMN     "backgroundId" TEXT,
ADD COLUMN     "buttonId" TEXT,
ADD COLUMN     "pageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "themes_pageId_key" ON "themes"("pageId");

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "backgrounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_buttonId_fkey" FOREIGN KEY ("buttonId") REFERENCES "buttons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
