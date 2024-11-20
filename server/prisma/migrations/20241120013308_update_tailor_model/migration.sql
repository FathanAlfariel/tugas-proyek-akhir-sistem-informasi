/*
  Warnings:

  - You are about to alter the column `available` on the `tailor` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `tailor` MODIFY `available` BOOLEAN NOT NULL DEFAULT false;
