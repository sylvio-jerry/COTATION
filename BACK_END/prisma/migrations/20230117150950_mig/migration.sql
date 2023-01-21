-- CreateTable
CREATE TABLE `Client` (
    `IdClient` INTEGER NOT NULL AUTO_INCREMENT,
    `NomClient` VARCHAR(191) NOT NULL,
    `PrenomsClient` VARCHAR(191) NOT NULL,
    `UsernameClient` VARCHAR(191) NOT NULL,
    `PwdClient` VARCHAR(191) NOT NULL,
    `EmailClient` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Client_UsernameClient_key`(`UsernameClient`),
    PRIMARY KEY (`IdClient`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `IdAdmin` INTEGER NOT NULL AUTO_INCREMENT,
    `NomAdmin` VARCHAR(191) NOT NULL,
    `PrenomsAdmin` VARCHAR(191) NOT NULL,
    `UsernameAdmin` VARCHAR(191) NOT NULL,
    `PwdAdmin` VARCHAR(191) NOT NULL,
    `EmailAdmin` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_UsernameAdmin_key`(`UsernameAdmin`),
    PRIMARY KEY (`IdAdmin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cota` (
    `RefCota` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`RefCota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
