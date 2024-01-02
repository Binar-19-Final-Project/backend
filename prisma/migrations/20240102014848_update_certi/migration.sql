/*
  Warnings:

  - You are about to drop the column `progress` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `certificate` table. All the data in the column will be lost.
  - Added the required column `url_certificate` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `progress`,
    DROP COLUMN `status`,
    ADD COLUMN `url_certificate` VARCHAR(191) NOT NULL;
