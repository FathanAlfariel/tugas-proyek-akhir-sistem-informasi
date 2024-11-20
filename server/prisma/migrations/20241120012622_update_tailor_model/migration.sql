/*
  Warnings:

  - You are about to drop the column `status` on the `tailor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tailor` DROP COLUMN `status`,
    ADD COLUMN `available` ENUM('true', 'false') NOT NULL DEFAULT 'false';
