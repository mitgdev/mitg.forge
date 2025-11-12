/*
  Warnings:

  - You are about to alter the column `charm_points` on the `player_charms` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.
  - You are about to alter the column `minor_charm_echoes` on the `player_charms` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.
  - You are about to alter the column `max_charm_points` on the `player_charms` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.
  - You are about to alter the column `max_minor_charm_echoes` on the `player_charms` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `player_charms` MODIFY `charm_points` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `minor_charm_echoes` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `max_charm_points` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `max_minor_charm_echoes` INTEGER UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `players` ADD COLUMN `weapon_proficiencies` MEDIUMBLOB NULL;
