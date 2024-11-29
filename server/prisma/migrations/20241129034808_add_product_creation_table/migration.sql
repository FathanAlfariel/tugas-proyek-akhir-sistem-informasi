/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `ProductCreation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tailorId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimationTime` DATETIME(3) NOT NULL,
    `status` ENUM('belum_dimulai', 'dalam_proses', 'selesai') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductCreation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Material_id_key` ON `Material`(`id`);

-- AddForeignKey
ALTER TABLE `ProductCreation` ADD CONSTRAINT `ProductCreation_tailorId_fkey` FOREIGN KEY (`tailorId`) REFERENCES `Tailor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
