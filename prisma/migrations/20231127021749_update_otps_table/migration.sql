/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `otps` table. All the data in the column will be lost.
  - Added the required column `expired_at` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otps` DROP COLUMN `expiredAt`,
    ADD COLUMN `expired_at` DATETIME(3) NOT NULL;
