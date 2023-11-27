/*
  Warnings:

  - You are about to drop the column `updated_at` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `url_photo` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `otps` table. All the data in the column will be lost.
  - Added the required column `email` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `otps` DROP FOREIGN KEY `otps_user_id_fkey`;

-- AlterTable
ALTER TABLE `otps` DROP COLUMN `updated_at`,
    DROP COLUMN `url_photo`,
    DROP COLUMN `user_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `otp` INTEGER NOT NULL;
