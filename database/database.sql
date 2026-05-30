-- ============================================================================
-- GRIT Hub Archive - Relational Database Schema Initialization Blueprint
-- Architecture: 3rd Normal Form (3NF) Many-to-Many
-- Target Engine: MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `grit_archive` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `grit_archive`;

-- ----------------------------------------------------------------------------
-- 1. Table Structure: Authors Matrix Node
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `api_author`;
CREATE TABLE `api_author` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `short_bionote` LONGTEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 2. Table Structure: Publishing Entities Matrix Node
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `api_publisher`;
CREATE TABLE `api_publisher` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 3. Table Structure: Central Relational Publications Matrix
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `api_publication`;
CREATE TABLE `api_publication` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `publication_type` VARCHAR(50) NOT NULL,
  `publication_date` DATE NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` LONGTEXT NULL,
  `abstract` LONGTEXT NULL,
  `publisher_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_publication_publisher_id_idx` (`publisher_id`),
  CONSTRAINT `fk_publication_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `api_publisher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 3.5 Table Structure: Many-To-Many Junction Bridge (Publications <-> Authors)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `api_publication_authors`;
CREATE TABLE `api_publication_authors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `publication_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_publication_authors_publication_id_author_id_uniq` (`publication_id`, `author_id`),
  KEY `api_publication_authors_author_id_idx` (`author_id`),
  CONSTRAINT `fk_junction_publication` FOREIGN KEY (`publication_id`) REFERENCES `api_publication` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_junction_author` FOREIGN KEY (`author_id`) REFERENCES `api_author` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 4. Core Framework Structural Infrastructure Tables (Django Standard)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_label` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_uniq` (`app_label`,`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `content_type_id` INT NOT NULL,
  `codename` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `fk_permission_content_type` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_uniq` (`group_id`,`permission_id`),
  CONSTRAINT `fk_group_permission_group` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_group_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(128) NOT NULL,
  `last_login` DATETIME(6) DEFAULT NULL,
  `is_superuser` TINYINT(1) NOT NULL,
  `username` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `is_staff` TINYINT(1) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `date_joined` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_uniq` (`user_id`,`group_id`),
  CONSTRAINT `fk_user_groups_group` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_groups_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_uniq` (`user_id`,`permission_id`),
  CONSTRAINT `fk_user_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `action_time` DATETIME(6) NOT NULL,
  `object_id` LONGTEXT NULL,
  `object_repr` VARCHAR(200) NOT NULL,
  `action_flag` SMALLINT UNSIGNED NOT NULL,
  `change_message` LONGTEXT NOT NULL,
  `content_type_id` INT DEFAULT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_admin_log_content_type` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_admin_log_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_admin_action_flag` CHECK (`action_flag` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `applied` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (
  `session_key` VARCHAR(40) NOT NULL,
  `session_data` LONGTEXT NOT NULL,
  `expire_date` DATETIME(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_idx` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- 5. Seed Core Meta Framework Content Identifiers
-- ----------------------------------------------------------------------------
LOCK TABLES `django_content_type` WRITE;
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES 
(1,'admin','logentry'),
(8,'api','author'),
(9,'api','publication'),
(7,'api','publisher'),
(3,'auth','group'),
(2,'auth','permission'),
(4,'auth','user'),
(5,'contenttypes','contenttype'),
(6,'sessions','session');
UNLOCK TABLES;

LOCK TABLES `auth_permission` WRITE;
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES 
(1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add publisher',7,'add_publisher'),(26,'Can change publisher',7,'change_publisher'),(27,'Can delete publisher',7,'delete_publisher'),(28,'Can view publisher',7,'view_publisher'),(29,'Can add author',8,'add_author'),(30,'Can change author',8,'change_author'),(31,'Can delete author',8,'delete_author'),(32,'Can view author',8,'view_author'),(33,'Can add publication',9,'add_publication'),(34,'Can change publication',9,'change_publication'),(35,'Can delete publication',9,'delete_publication'),(36,'Can view publication',9,'view_publication');
UNLOCK TABLES;

LOCK TABLES `django_migrations` WRITE;
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES 
(1,'contenttypes','0001_initial',NOW(6)),(2,'auth','0001_initial',NOW(6)),(3,'admin','0001_initial',NOW(6)),(4,'admin','0002_logentry_remove_auto_add',NOW(6)),(5,'admin','0003_logentry_add_action_flag_choices',NOW(6)),(6,'contenttypes','0002_remove_content_type_name',NOW(6)),(7,'auth','0002_alter_permission_name_max_length',NOW(6)),(8,'auth','0003_alter_user_email_max_length',NOW(6)),(9,'auth','0004_alter_user_username_opts',NOW(6)),(10,'auth','0005_alter_user_last_login_null',NOW(6)),(11,'auth','0006_require_contenttypes_0002',NOW(6)),(12,'auth','0007_alter_validators_add_error_messages',NOW(6)),(13,'auth','0008_alter_user_username_max_length',NOW(6)),(14,'auth','0009_alter_user_last_name_max_length',NOW(6)),(15,'auth','0010_alter_group_name_max_length',NOW(6)),(16,'auth','0011_update_proxy_permissions',NOW(6)),(17,'auth','0012_alter_user_first_name_max_length',NOW(6)),(18,'sessions','0001_initial',NOW(6)),(19,'api','0001_initial',NOW(6));
UNLOCK TABLES;

-- Append to your API_AUTHOR table schema
ALTER TABLE API_AUTHOR ADD COLUMN image_url TEXT NULL;

-- Append to your API_PUBLISHER table schema
ALTER TABLE API_PUBLISHER ADD COLUMN image_url TEXT NULL;