/*
  Warnings:

  - Added the required column `addToLinkedin` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` ADD COLUMN `addToLinkedin` VARCHAR(191) NOT NULL;
