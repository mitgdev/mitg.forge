-- CreateTable
CREATE TABLE `miforge_shop_orders` (
    `id` VARCHAR(191) NOT NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `payment_option_id` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'CANCELLED', 'PAID', 'PENDING_PAYMENT', 'REFUNDED', 'CONTESTED') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miforge_shop_order_items` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unit_price_cents` INTEGER UNSIGNED NOT NULL,
    `total_price_cents` INTEGER UNSIGNED NOT NULL,
    `effective_quantity` INTEGER UNSIGNED NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miforge_shop_products` (
    `id` VARCHAR(191) NOT NULL,
    `category` ENUM('COINS', 'RECOVERY_KEY', 'CHANGE_NAME') NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `base_unit_quantity` INTEGER NOT NULL DEFAULT 1,
    `quantity_mode` ENUM('FIXED', 'VARIABLE') NOT NULL,
    `min_units` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `max_units` INTEGER UNSIGNED NULL,
    `unit_step` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `unit_price_cents` INTEGER UNSIGNED NOT NULL,
    `display_unit_label` VARCHAR(32) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miforge_shop_products_slug_key`(`slug`),
    INDEX `idx_shop_product_slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miforge_shop_payment_options` (
    `id` VARCHAR(191) NOT NULL,
    `provider` ENUM('MERCADO_PAGO') NOT NULL,
    `method` ENUM('PIX') NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `label` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miforge_shop_payment_options_provider_method_key`(`provider`, `method`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `miforge_shop_orders` ADD CONSTRAINT `miforge_shop_orders_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miforge_shop_orders` ADD CONSTRAINT `miforge_shop_orders_payment_option_id_fkey` FOREIGN KEY (`payment_option_id`) REFERENCES `miforge_shop_payment_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miforge_shop_order_items` ADD CONSTRAINT `miforge_shop_order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `miforge_shop_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miforge_shop_order_items` ADD CONSTRAINT `miforge_shop_order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `miforge_shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
