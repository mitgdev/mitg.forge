-- CreateTable
CREATE TABLE `worlds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `type` ENUM('no-pvp', 'pvp', 'retro-pvp', 'pvp-enforced', 'retro-hardcore') NOT NULL,
    `motd` VARCHAR(255) NOT NULL,
    `location` ENUM('Europe', 'North America', 'South America', 'Oceania') NOT NULL,
    `ip` VARCHAR(45) NOT NULL,
    `port` SMALLINT UNSIGNED NOT NULL,
    `port_status` MEDIUMINT UNSIGNED NOT NULL,
    `creation` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
