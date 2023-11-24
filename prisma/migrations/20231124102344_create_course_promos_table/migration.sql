-- CreateTable
CREATE TABLE `course_promos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_course_promo_id_fkey` FOREIGN KEY (`course_promo_id`) REFERENCES `course_promos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
