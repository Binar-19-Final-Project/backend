/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `course_contents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `course_modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `course_contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `course_modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_contents` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `course_modules` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `course_contents_slug_key` ON `course_contents`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `course_modules_slug_key` ON `course_modules`(`slug`);
