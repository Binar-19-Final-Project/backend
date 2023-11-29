/*
  Warnings:

  - Added the required column `urlPhoto` to the `course_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_categories` ADD COLUMN `urlPhoto` VARCHAR(191) NOT NULL;
