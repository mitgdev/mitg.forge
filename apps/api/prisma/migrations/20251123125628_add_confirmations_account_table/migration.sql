-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `email_confirmed` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `miforge_account_confirmations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('EMAIL_VERIFICATION') NOT NULL,
    `channel` ENUM('LINK', 'CODE') NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `value` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `confirmed_at` DATETIME(3) NULL,
    `cancelled_at` DATETIME(3) NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `max_attempts` INTEGER NOT NULL DEFAULT 5,
    `last_attempt_at` DATETIME(3) NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_account_type_expires`(`account_id`, `type`, `channel`, `expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_account_confirmations` ADD CONSTRAINT `miforge_account_confirmations_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
