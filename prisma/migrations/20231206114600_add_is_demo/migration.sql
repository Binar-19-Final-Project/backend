/*
  Warnings:

  - Added the required column `is_demo` to the `course_contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_contents` ADD COLUMN `is_demo` BOOLEAN NOT NULL,
    ALTER COLUMN `is_free` DROP DEFAULT;
