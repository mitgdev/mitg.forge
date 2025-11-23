/*
  Warnings:

  - A unique constraint covering the columns `[token,account_id]` on the table `miforge_account_confirmations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `miforge_account_confirmations_token_account_id_key` ON `miforge_account_confirmations`(`token`, `account_id`);
