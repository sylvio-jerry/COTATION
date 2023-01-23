/*
  Warnings:

  - You are about to alter the column `PoidsVehicule` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `PoidsColis` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `Amorcage` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `cars` MODIFY `PoidsVehicule` DECIMAL(10, 2) NOT NULL,
    MODIFY `PoidsColis` DECIMAL(10, 2) NOT NULL,
    MODIFY `Amorcage` DECIMAL(10, 2) NOT NULL,
    MODIFY `DateArriveeAuPort` DATE NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- CreateTable
CREATE TABLE `utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `pseudo` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `tel` VARCHAR(10) NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
