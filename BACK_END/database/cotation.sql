-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 24 jan. 2023 à 10:03
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cotation`
--

-- --------------------------------------------------------

--
-- Structure de la table `cars`
--

CREATE TABLE `cars` (
  `IdVehicule` int(11) NOT NULL,
  `Matricule` varchar(191) NOT NULL,
  `Marque` varchar(191) NOT NULL,
  `Version` varchar(191) NOT NULL,
  `EtatVehicule` enum('NEUVE','OCCASION','CAMION','ENGIN','REMORQUE') NOT NULL,
  `PoidsVehicule` decimal(10,2) NOT NULL,
  `PoidsColis` decimal(10,2) NOT NULL,
  `Amorcage` decimal(10,2) NOT NULL,
  `DateArriveeAuPort` date NOT NULL,
  `isDisponible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cars`
--

INSERT INTO `cars` (`IdVehicule`, `Matricule`, `Marque`, `Version`, `EtatVehicule`, `PoidsVehicule`, `PoidsColis`, `Amorcage`, `DateArriveeAuPort`, `isDisponible`) VALUES
(2, 'FDS5587', 'BMW', 'X5', 'OCCASION', '1.00', '0.50', '10.00', '2023-01-13', 1),
(3, '4444444', '4444', '444', 'CAMION', '4.00', '4.00', '4.00', '2023-12-31', 0),
(5, '4756820', '7777', '777', 'CAMION', '77.00', '77.00', '7.00', '2023-12-31', 1),
(6, '550000', '005', '555', 'OCCASION', '57.00', '5.00', '7.00', '2023-12-17', 1),
(7, '746378', '478888', '255', 'CAMION', '58.00', '6.00', '7.00', '2023-01-23', 1),
(8, '365478', '777', '777', 'CAMION', '7.00', '7.00', '7.00', '2023-12-31', 0),
(9, '123457', 'azzzzz', 'az', 'CAMION', '8.00', '8.00', '8.00', '2023-12-31', 1),
(10, '855555', '555', '555', 'REMORQUE', '5.00', '5.00', '9.00', '2023-01-11', 0),
(11, '121212', '121212', '121', 'ENGIN', '12.00', '12.00', '12.00', '2023-12-31', 0),
(12, '6520AF', 'RENAULT', 'CHAMADE', 'OCCASION', '2.00', '1.00', '1.50', '2023-01-12', 1),
(13, '515ZDQ', 'LAMBO', 'GALLARDO', 'NEUVE', '5.00', '1.00', '1.50', '2023-01-05', 1),
(14, '465zaz', 'TESLA', 'X1', 'OCCASION', '5.00', '1.00', '5.30', '2022-01-01', 0);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `IdClient` int(11) NOT NULL,
  `NomClient` varchar(191) NOT NULL,
  `PrenomsClient` varchar(191) NOT NULL,
  `UsernameClient` varchar(191) NOT NULL,
  `PwdClient` varchar(191) NOT NULL,
  `EmailClient` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cota`
--

CREATE TABLE `cota` (
  `RefCota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `tel` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `pseudo`, `email`, `tel`, `password`, `is_admin`) VALUES
(2, 'Joh', 'joh', 'razozyiany@gmail.com', '0348856382', '$2a$10$qxSdsZnqv3Veqc8I4AXz8etP6gM6rA3rvS0HNaZs5ntIJ2ULSJy4K', 1),
(4, 'sylvio', 'jerry', 'nabo.sylvio@gmail.com', NULL, '$2a$10$TyPpIWa6o89PVE0E6YzRVeLr.Q9BhiGMEa4Xj4khWcEPl3ObcQvo2', 0);

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('29c8f513-0b52-4479-a563-084dc7e59032', '53215de2568788c2c7d3701300593d81f6bd7815203dc997545f0fde63c0c9c9', '2023-01-23 07:45:44.593', '20230123074544_mig', NULL, NULL, '2023-01-23 07:45:44.505', 1),
('a50ad301-1a0a-47d4-88c3-77b1b48bb392', '4c43fd1e1350a123ecc249280eae97ff0e5a93a834163e43e915b9a8b41790d1', '2023-01-23 07:45:37.100', '20230117141438_mig', NULL, NULL, '2023-01-23 07:45:37.074', 1),
('e2fd074a-bc68-4991-a268-cc993feaa43b', '8500d683bdee944f848b11e1d9bb80e029ef2ebd05fac46e2e1bae866e2ce12d', '2023-01-23 07:45:37.168', '20230117150950_mig', NULL, NULL, '2023-01-23 07:45:37.103', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`IdVehicule`),
  ADD UNIQUE KEY `Cars_Matricule_key` (`Matricule`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`IdClient`),
  ADD UNIQUE KEY `Client_UsernameClient_key` (`UsernameClient`);

--
-- Index pour la table `cota`
--
ALTER TABLE `cota`
  ADD PRIMARY KEY (`RefCota`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cars`
--
ALTER TABLE `cars`
  MODIFY `IdVehicule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `IdClient` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cota`
--
ALTER TABLE `cota`
  MODIFY `RefCota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
