/*
  Warnings:

  - Added the required column `duration` to the `course_contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_contents` ADD COLUMN `duration` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `duration` INTEGER NOT NULL;
