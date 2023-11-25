/*
  Warnings:

  - Added the required column `title` to the `course_contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_contents` ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `is_free` BOOLEAN NOT NULL DEFAULT true;
