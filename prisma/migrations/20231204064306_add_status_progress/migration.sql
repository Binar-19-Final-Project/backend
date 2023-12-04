/*
  Warnings:

  - Added the required column `status` to the `user_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_courses` ADD COLUMN `status` VARCHAR(191) NOT NULL;
