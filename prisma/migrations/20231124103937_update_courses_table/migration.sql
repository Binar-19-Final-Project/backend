/*
  Warnings:

  - You are about to drop the column `instructorId` on the `courses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_instructor_id` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_instructorId_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `instructorId`,
    ADD COLUMN `course_instructor_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `courses_slug_key` ON `courses`(`slug`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_course_instructor_id_fkey` FOREIGN KEY (`course_instructor_id`) REFERENCES `course_instructors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
