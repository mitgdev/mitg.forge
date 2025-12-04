-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `two_factor_confirmed_at` DATETIME(3) NULL,
    ADD COLUMN `two_factor_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `two_factor_secret` VARCHAR(64) NULL,
    ADD COLUMN `two_factor_temp_secret` VARCHAR(64) NULL;
