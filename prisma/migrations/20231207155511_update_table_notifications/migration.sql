/*
  Warnings:

  - You are about to drop the `user_notifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_notifications` DROP FOREIGN KEY `user_notifications_user_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `data` JSON NULL,
    ADD COLUMN `read_at` DATETIME(3) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `message` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `user_notifications`;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
