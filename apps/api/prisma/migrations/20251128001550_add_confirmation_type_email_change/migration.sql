-- AlterTable
ALTER TABLE `miforge_account_confirmations` MODIFY `type` ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE') NOT NULL;
