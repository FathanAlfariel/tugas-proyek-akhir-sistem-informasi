/*
  Warnings:

  - Added the required column `total` to the `ProductCreation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productcreation` ADD COLUMN `total` INTEGER NOT NULL;
