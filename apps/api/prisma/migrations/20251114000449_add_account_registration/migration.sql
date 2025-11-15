-- CreateTable
CREATE TABLE `miforge_account_registration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `number` VARCHAR(50) NOT NULL,
    `postal` VARCHAR(20) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `additional` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `recovery_key` VARCHAR(255) NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `miforge_account_registration_recovery_key_key`(`recovery_key`),
    UNIQUE INDEX `miforge_account_registration_account_id_key`(`account_id`),
    INDEX `idx_account_id`(`account_id`),
    INDEX `idx_recovery_key`(`recovery_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_account_registration` ADD CONSTRAINT `miforge_account_registration_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
