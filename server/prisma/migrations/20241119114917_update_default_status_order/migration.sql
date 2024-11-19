-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('belum_bayar', 'sedang_dikemas', 'dikirim', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'belum_bayar';
