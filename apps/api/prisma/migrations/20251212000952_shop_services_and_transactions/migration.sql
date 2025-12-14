-- CreateTable
CREATE TABLE `miforge_shop_service` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('COINS') NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `quantity` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miforge_shop_service_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miforge_shop_transactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `method` ENUM('MERCADO_PAGO_PIX') NOT NULL,
    `units` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `total` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_shop_transactions` ADD CONSTRAINT `miforge_shop_transactions_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `miforge_shop_service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miforge_shop_transactions` ADD CONSTRAINT `miforge_shop_transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
