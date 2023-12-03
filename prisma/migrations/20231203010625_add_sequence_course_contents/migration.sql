/*
  Warnings:

  - Added the required column `sequence` to the `course_contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_contents` ADD COLUMN `sequence` INTEGER NOT NULL;
