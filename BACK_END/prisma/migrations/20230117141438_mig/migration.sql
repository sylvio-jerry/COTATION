-- CreateTable
CREATE TABLE `Cars` (
    `IdVehicule` INTEGER NOT NULL AUTO_INCREMENT,
    `Matricule` VARCHAR(191) NOT NULL,
    `Marque` VARCHAR(191) NOT NULL,
    `Version` VARCHAR(191) NOT NULL,
    `EtatVehicule` ENUM('NEUVE', 'OCCASION', 'CAMION', 'ENGIN', 'REMORQUE') NOT NULL,
    `PoidsVehicule` INTEGER NOT NULL,
    `PoidsColis` INTEGER NOT NULL,
    `Amorcage` INTEGER NOT NULL,
    `DateArriveeAuPort` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cars_Matricule_key`(`Matricule`),
    PRIMARY KEY (`IdVehicule`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
