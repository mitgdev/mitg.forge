/*
  Warnings:

  - You are about to drop the column `price` on the `miforge_shop_service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `miforge_shop_service` DROP COLUMN `price`,
    ADD COLUMN `unit_price` INTEGER UNSIGNED NOT NULL DEFAULT 0;
