/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `course_instructors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `course_levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `course_promos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `course_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `course_instructors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `course_levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `course_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `course_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_instructors` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `course_levels` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `course_promos` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `course_types` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `course_instructors_slug_key` ON `course_instructors`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `course_levels_slug_key` ON `course_levels`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `course_promos_slug_key` ON `course_promos`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `course_types_slug_key` ON `course_types`(`slug`);
