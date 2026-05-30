-- ============================================================================
-- GRIT Hub Archive - Corrected Schema Initialization
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `grit_archive` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `grit_archive`;

-- 1. Table Structure: Authors Matrix Node
DROP TABLE IF EXISTS `api_author`;
CREATE TABLE `api_author` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `short_bionote` LONGTEXT NULL,
  `image_url` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Table Structure: Publishing Entities Matrix Node
DROP TABLE IF EXISTS `api_publisher`;
CREATE TABLE `api_publisher` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `image_url` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Table Structure: Central Relational Publications Matrix
DROP TABLE IF EXISTS `api_publication`;
CREATE TABLE `api_publication` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `publication_type` VARCHAR(50) NOT NULL,
  `publication_date` DATE NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `description` LONGTEXT NULL,
  `abstract` LONGTEXT NULL,
  `publisher_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_publication_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `api_publisher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3.5 Many-To-Many Bridge
DROP TABLE IF EXISTS `api_publication_authors`;
CREATE TABLE `api_publication_authors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `publication_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pub_auth` (`publication_id`, `author_id`),
  CONSTRAINT `fk_junction_publication` FOREIGN KEY (`publication_id`) REFERENCES `api_publication` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_junction_author` FOREIGN KEY (`author_id`) REFERENCES `api_author` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Essential Migration State (Used '2026-05-30 00:00:00' instead of NOW(6) to avoid execution errors)
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `applied` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `django_migrations` (`app`, `name`, `applied`) VALUES 
('api', '0001_initial', '2026-05-30 00:00:00');