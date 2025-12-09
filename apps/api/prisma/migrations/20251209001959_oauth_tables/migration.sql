-- CreateTable
CREATE TABLE `miforge_account_oauths` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('DISCORD') NOT NULL,
    `provider_account_id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NULL,
    `display_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `avatar_url` VARCHAR(512) NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `expires_at` DATETIME(3) NULL,
    `scope` VARCHAR(255) NULL,
    `raw_profile` JSON NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `oauth_account_provider_idx`(`account_id`, `provider`),
    UNIQUE INDEX `miforge_account_oauths_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_account_oauths` ADD CONSTRAINT `miforge_account_oauths_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
