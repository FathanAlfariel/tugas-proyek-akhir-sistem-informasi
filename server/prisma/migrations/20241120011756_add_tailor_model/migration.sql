-- CreateTable
CREATE TABLE `Tailor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('true', 'false') NOT NULL DEFAULT 'false',

    UNIQUE INDEX `Tailor_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
