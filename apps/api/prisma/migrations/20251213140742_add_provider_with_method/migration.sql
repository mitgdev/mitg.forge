/*
  Warnings:

  - The values [MERCADO_PAGO_PIX] on the enum `miforge_shop_transactions_method` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `provider` to the `miforge_shop_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `miforge_shop_transactions` ADD COLUMN `provider` ENUM('MERCADO_PAGO') NOT NULL,
    MODIFY `method` ENUM('PIX') NOT NULL;

-- CreateIndex
CREATE INDEX `idx_service_account_provider` ON `miforge_shop_transactions`(`service_id`, `account_id`);

-- CreateIndex
CREATE INDEX `idx_method_transaction_id` ON `miforge_shop_transactions`(`method_transaction_id`);

-- CreateIndex
CREATE INDEX `idx_status` ON `miforge_shop_transactions`(`status`);

-- CreateIndex
CREATE INDEX `idx_provider` ON `miforge_shop_transactions`(`provider`);
