-- AlterTable
ALTER TABLE `players` ADD COLUMN `ishidden` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ismain` BOOLEAN NOT NULL DEFAULT false;
