-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_categoryId_fkey`;

-- DropIndex
DROP INDEX `notes_categoryId_fkey` ON `notes`;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
