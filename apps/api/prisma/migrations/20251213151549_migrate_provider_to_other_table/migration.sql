/*
  Warnings:

  - You are about to drop the column `method` on the `miforge_shop_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `miforge_shop_transactions` table. All the data in the column will be lost.
  - Added the required column `provider_id` to the `miforge_shop_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `idx_provider` ON `miforge_shop_transactions`;

-- AlterTable
ALTER TABLE `miforge_shop_transactions` DROP COLUMN `method`,
    DROP COLUMN `provider`,
    ADD COLUMN `provider_id` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `miforge_shop_providers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `method` ENUM('PIX') NOT NULL,
    `provider` ENUM('MERCADO_PAGO') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miforge_shop_providers_method_provider_key`(`method`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_shop_transactions` ADD CONSTRAINT `miforge_shop_transactions_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `miforge_shop_providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
