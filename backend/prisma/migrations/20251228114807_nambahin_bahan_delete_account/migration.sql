-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_username_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_username_fkey`;

-- DropIndex
DROP INDEX `notes_username_fkey` ON `notes`;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
