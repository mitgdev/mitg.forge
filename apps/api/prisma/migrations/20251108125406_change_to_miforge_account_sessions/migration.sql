/*
  Warnings:

  - You are about to drop the `miforge_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `miforge_sessions` DROP FOREIGN KEY `miforge_sessions_account_id_fkey`;

-- DropTable
DROP TABLE `miforge_sessions`;

-- CreateTable
CREATE TABLE `miforge_account_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(512) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `protocol` VARCHAR(191) NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `miforge_account_sessions_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_account_sessions` ADD CONSTRAINT `miforge_account_sessions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
