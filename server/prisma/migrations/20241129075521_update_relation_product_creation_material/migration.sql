-- DropForeignKey
ALTER TABLE `productcreationmaterial` DROP FOREIGN KEY `ProductCreationMaterial_productCreationId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductCreationMaterial` ADD CONSTRAINT `ProductCreationMaterial_productCreationId_fkey` FOREIGN KEY (`productCreationId`) REFERENCES `ProductCreation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
