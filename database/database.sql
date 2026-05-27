-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: grit_archive
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_author`
--

DROP TABLE IF EXISTS `api_author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_author` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `short_bionote` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_author`
--

LOCK TABLES `api_author` WRITE;
/*!40000 ALTER TABLE `api_author` DISABLE KEYS */;
INSERT INTO `api_author` VALUES (2,'Jemar John','Lumingkit','Testing'),(3,'Jemar John','Lumingkit','Computational Policy Researcher');
/*!40000 ALTER TABLE `api_author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_publication`
--

DROP TABLE IF EXISTS `api_publication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_publication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `publication_type` varchar(50) NOT NULL,
  `publication_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` longtext,
  `abstract` longtext,
  `author_id` int NOT NULL,
  `publisher_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_publication_author_id_6a97b61c_fk_api_author_id` (`author_id`),
  KEY `api_publication_publisher_id_a8a7a9f6_fk_api_publisher_id` (`publisher_id`),
  CONSTRAINT `api_publication_author_id_6a97b61c_fk_api_author_id` FOREIGN KEY (`author_id`) REFERENCES `api_author` (`id`),
  CONSTRAINT `api_publication_publisher_id_a8a7a9f6_fk_api_publisher_id` FOREIGN KEY (`publisher_id`) REFERENCES `api_publisher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_publication`
--

LOCK TABLES `api_publication` WRITE;
/*!40000 ALTER TABLE `api_publication` DISABLE KEYS */;
INSERT INTO `api_publication` VALUES (2,'Policy Intervention Strategy Evaluation Matrix - Volume 1','Journal Article','2026-05-02',54153.54,NULL,NULL,3,2),(3,'Policy Intervention Strategy Evaluation Matrix - Volume 2','Research Paper','2026-05-03',152.50,NULL,NULL,3,2),(4,'Policy Intervention Strategy Evaluation Matrix - Volume 3','Report','2026-05-04',153.50,NULL,NULL,3,2),(5,'Policy Intervention Strategy Evaluation Matrix - Volume 4','Book','2026-05-05',154.50,NULL,NULL,3,2),(6,'Policy Intervention Strategy Evaluation Matrix - Volume 5','Journal Article','2026-05-06',155.50,NULL,NULL,3,2),(7,'Policy Intervention Strategy Evaluation Matrix - Volume 6','Research Paper','2026-05-07',156.50,NULL,NULL,3,2),(8,'Policy Intervention Strategy Evaluation Matrix - Volume 7','Report','2026-05-08',157.50,NULL,NULL,3,2),(9,'Policy Intervention Strategy Evaluation Matrix - Volume 8','Book','2026-05-09',158.50,NULL,NULL,3,2),(10,'Policy Intervention Strategy Evaluation Matrix - Volume 9','Journal Article','2026-05-10',159.50,NULL,NULL,3,2),(11,'Policy Intervention Strategy Evaluation Matrix - Volume 10','Research Paper','2026-05-11',160.50,NULL,NULL,3,2),(12,'Policy Intervention Strategy Evaluation Matrix - Volume 11','Report','2026-05-12',161.50,NULL,NULL,3,2),(13,'Policy Intervention Strategy Evaluation Matrix - Volume 12','Book','2026-05-13',162.50,NULL,NULL,3,2),(14,'Policy Intervention Strategy Evaluation Matrix - Volume 13','Journal Article','2026-05-14',163.50,NULL,NULL,3,2),(15,'Policy Intervention Strategy Evaluation Matrix - Volume 14','Research Paper','2026-05-15',164.50,NULL,NULL,3,2),(16,'Policy Intervention Strategy Evaluation Matrix - Volume 15','Report','2026-05-16',165.50,NULL,NULL,3,2),(17,'Policy Intervention Strategy Evaluation Matrix - Volume 16','Book','2026-05-17',166.50,NULL,NULL,3,2),(18,'Policy Intervention Strategy Evaluation Matrix - Volume 17','Journal Article','2026-05-18',167.50,NULL,NULL,3,2),(19,'Policy Intervention Strategy Evaluation Matrix - Volume 18','Research Paper','2026-05-19',168.50,NULL,NULL,3,2),(20,'Policy Intervention Strategy Evaluation Matrix - Volume 19','Report','2026-05-20',169.50,NULL,NULL,3,2),(21,'Policy Intervention Strategy Evaluation Matrix - Volume 20','Book','2026-05-21',170.50,NULL,NULL,3,2),(22,'Policy Intervention Strategy Evaluation Matrix - Volume 21','Journal Article','2026-05-22',171.50,NULL,NULL,3,2),(23,'Policy Intervention Strategy Evaluation Matrix - Volume 22','Research Paper','2026-05-23',172.50,NULL,NULL,3,2),(24,'Policy Intervention Strategy Evaluation Matrix - Volume 23','Report','2026-05-24',173.50,NULL,NULL,3,2),(25,'Policy Intervention Strategy Evaluation Matrix - Volume 24','Book','2026-05-25',174.50,NULL,NULL,3,2),(26,'Policy Intervention Strategy Evaluation Matrix - Volume 25','Journal Article','2026-05-26',175.50,NULL,NULL,3,2),(27,'Policy Intervention Strategy Evaluation Matrix - Volume 26','Research Paper','2026-05-27',176.50,NULL,NULL,3,2),(28,'Policy Intervention Strategy Evaluation Matrix - Volume 27','Report','2026-05-28',177.50,NULL,NULL,3,2),(29,'Policy Intervention Strategy Evaluation Matrix - Volume 28','Book','2026-05-01',178.50,NULL,NULL,3,2),(30,'Policy Intervention Strategy Evaluation Matrix - Volume 29','Journal Article','2026-05-02',179.50,NULL,NULL,3,2),(31,'Policy Intervention Strategy Evaluation Matrix - Volume 30','Research Paper','2026-05-03',180.50,NULL,NULL,3,2),(32,'Policy Intervention Strategy Evaluation Matrix - Volume 31','Report','2026-05-04',181.50,NULL,NULL,3,2),(33,'Policy Intervention Strategy Evaluation Matrix - Volume 32','Book','2026-05-05',182.50,NULL,NULL,3,2),(34,'Policy Intervention Strategy Evaluation Matrix - Volume 33','Journal Article','2026-05-06',183.50,NULL,NULL,3,2),(35,'Policy Intervention Strategy Evaluation Matrix - Volume 34','Research Paper','2026-05-07',184.50,NULL,NULL,3,2),(36,'Policy Intervention Strategy Evaluation Matrix - Volume 35','Report','2026-05-08',185.50,NULL,NULL,3,2),(37,'Policy Intervention Strategy Evaluation Matrix - Volume 36','Book','2026-05-09',186.50,NULL,NULL,3,2),(38,'Policy Intervention Strategy Evaluation Matrix - Volume 37','Journal Article','2026-05-10',187.50,NULL,NULL,3,2),(39,'Policy Intervention Strategy Evaluation Matrix - Volume 38','Research Paper','2026-05-11',188.50,NULL,NULL,3,2),(40,'Policy Intervention Strategy Evaluation Matrix - Volume 39','Report','2026-05-12',189.50,NULL,NULL,3,2),(41,'Policy Intervention Strategy Evaluation Matrix - Volume 40','Book','2026-05-13',190.50,NULL,NULL,3,2),(42,'Policy Intervention Strategy Evaluation Matrix - Volume 41','Journal Article','2026-05-14',191.50,NULL,NULL,3,2),(43,'Policy Intervention Strategy Evaluation Matrix - Volume 42','Research Paper','2026-05-15',192.50,NULL,NULL,3,2),(44,'Policy Intervention Strategy Evaluation Matrix - Volume 43','Report','2026-05-16',193.50,NULL,NULL,3,2),(45,'Policy Intervention Strategy Evaluation Matrix - Volume 44','Book','2026-05-17',194.50,NULL,NULL,3,2),(46,'Policy Intervention Strategy Evaluation Matrix - Volume 45','Journal Article','2026-05-18',195.50,NULL,NULL,3,2),(47,'Policy Intervention Strategy Evaluation Matrix - Volume 46','Research Paper','2026-05-19',196.50,NULL,NULL,3,2),(48,'Policy Intervention Strategy Evaluation Matrix - Volume 47','Report','2026-05-20',197.50,NULL,NULL,3,2),(49,'Policy Intervention Strategy Evaluation Matrix - Volume 48','Book','2026-05-21',198.50,NULL,NULL,3,2),(50,'Policy Intervention Strategy Evaluation Matrix - Volume 49','Journal Article','2026-05-22',199.50,NULL,NULL,3,2),(51,'Policy Intervention Strategy Evaluation Matrix - Volume 50','Research Paper','2026-05-23',200.50,NULL,NULL,3,2),(52,'Policy Intervention Strategy Evaluation Matrix - Volume 51','Report','2026-05-24',201.50,NULL,NULL,3,2),(53,'Policy Intervention Strategy Evaluation Matrix - Volume 52','Book','2026-05-25',202.50,NULL,NULL,3,2),(54,'Policy Intervention Strategy Evaluation Matrix - Volume 53','Journal Article','2026-05-26',203.50,NULL,NULL,3,2),(55,'Policy Intervention Strategy Evaluation Matrix - Volume 54','Research Paper','2026-05-27',204.50,NULL,NULL,3,2),(56,'Policy Intervention Strategy Evaluation Matrix - Volume 55','Report','2026-05-28',205.50,NULL,NULL,3,2),(57,'Policy Intervention Strategy Evaluation Matrix - Volume 56','Book','2026-05-01',206.50,NULL,NULL,3,2),(58,'Policy Intervention Strategy Evaluation Matrix - Volume 57','Journal Article','2026-05-02',207.50,NULL,NULL,3,2),(59,'Policy Intervention Strategy Evaluation Matrix - Volume 58','Research Paper','2026-05-03',208.50,NULL,NULL,3,2),(60,'Policy Intervention Strategy Evaluation Matrix - Volume 59','Report','2026-05-04',209.50,NULL,NULL,3,2),(61,'Policy Intervention Strategy Evaluation Matrix - Volume 60','Book','2026-05-05',210.50,NULL,NULL,3,2),(62,'Policy Intervention Strategy Evaluation Matrix - Volume 61','Journal Article','2026-05-06',211.50,NULL,NULL,3,2),(63,'Policy Intervention Strategy Evaluation Matrix - Volume 62','Research Paper','2026-05-07',212.50,NULL,NULL,3,2),(64,'Policy Intervention Strategy Evaluation Matrix - Volume 63','Report','2026-05-08',213.50,NULL,NULL,3,2),(65,'Policy Intervention Strategy Evaluation Matrix - Volume 64','Book','2026-05-09',214.50,NULL,NULL,3,2),(66,'Policy Intervention Strategy Evaluation Matrix - Volume 65','Journal Article','2026-05-10',215.50,NULL,NULL,3,2),(67,'Policy Intervention Strategy Evaluation Matrix - Volume 66','Research Paper','2026-05-11',216.50,NULL,NULL,3,2),(68,'Policy Intervention Strategy Evaluation Matrix - Volume 67','Report','2026-05-12',217.50,NULL,NULL,3,2),(69,'Policy Intervention Strategy Evaluation Matrix - Volume 68','Book','2026-05-13',218.50,NULL,NULL,3,2),(70,'Policy Intervention Strategy Evaluation Matrix - Volume 69','Journal Article','2026-05-14',219.50,NULL,NULL,3,2),(71,'Policy Intervention Strategy Evaluation Matrix - Volume 70','Research Paper','2026-05-15',220.50,NULL,NULL,3,2),(72,'Policy Intervention Strategy Evaluation Matrix - Volume 71','Report','2026-05-16',221.50,NULL,NULL,3,2),(73,'Policy Intervention Strategy Evaluation Matrix - Volume 72','Book','2026-05-17',222.50,NULL,NULL,3,2),(74,'Policy Intervention Strategy Evaluation Matrix - Volume 73','Journal Article','2026-05-18',223.50,NULL,NULL,3,2),(75,'Policy Intervention Strategy Evaluation Matrix - Volume 74','Research Paper','2026-05-19',224.50,NULL,NULL,3,2),(76,'Policy Intervention Strategy Evaluation Matrix - Volume 75','Report','2026-05-20',225.50,NULL,NULL,3,2),(77,'Policy Intervention Strategy Evaluation Matrix - Volume 76','Book','2026-05-21',226.50,NULL,NULL,3,2),(78,'Policy Intervention Strategy Evaluation Matrix - Volume 77','Journal Article','2026-05-22',227.50,NULL,NULL,3,2),(79,'Policy Intervention Strategy Evaluation Matrix - Volume 78','Research Paper','2026-05-23',228.50,NULL,NULL,3,2),(80,'Policy Intervention Strategy Evaluation Matrix - Volume 79','Report','2026-05-24',229.50,NULL,NULL,3,2),(81,'Policy Intervention Strategy Evaluation Matrix - Volume 80','Book','2026-05-25',230.50,NULL,NULL,3,2),(82,'Policy Intervention Strategy Evaluation Matrix - Volume 81','Journal Article','2026-05-26',231.50,NULL,NULL,3,2),(83,'Policy Intervention Strategy Evaluation Matrix - Volume 82','Research Paper','2026-05-27',232.50,NULL,NULL,3,2),(84,'Policy Intervention Strategy Evaluation Matrix - Volume 83','Report','2026-05-28',233.50,NULL,NULL,3,2),(85,'Policy Intervention Strategy Evaluation Matrix - Volume 84','Book','2026-05-01',234.50,NULL,NULL,3,2),(86,'Policy Intervention Strategy Evaluation Matrix - Volume 85','Journal Article','2026-05-02',235.50,NULL,NULL,3,2),(87,'Policy Intervention Strategy Evaluation Matrix - Volume 86','Research Paper','2026-05-03',236.50,NULL,NULL,3,2),(88,'Policy Intervention Strategy Evaluation Matrix - Volume 87','Report','2026-05-04',237.50,NULL,NULL,3,2),(89,'Policy Intervention Strategy Evaluation Matrix - Volume 88','Book','2026-05-05',238.50,NULL,NULL,3,2),(90,'Policy Intervention Strategy Evaluation Matrix - Volume 89','Journal Article','2026-05-06',239.50,NULL,NULL,3,2),(91,'Policy Intervention Strategy Evaluation Matrix - Volume 90','Research Paper','2026-05-07',240.50,NULL,NULL,3,2),(92,'Policy Intervention Strategy Evaluation Matrix - Volume 91','Report','2026-05-08',241.50,NULL,NULL,3,2),(93,'Policy Intervention Strategy Evaluation Matrix - Volume 92','Book','2026-05-09',242.50,NULL,NULL,3,2),(94,'Policy Intervention Strategy Evaluation Matrix - Volume 93','Journal Article','2026-05-10',243.50,NULL,NULL,3,2),(95,'Policy Intervention Strategy Evaluation Matrix - Volume 94','Research Paper','2026-05-11',244.50,NULL,NULL,3,2),(96,'Policy Intervention Strategy Evaluation Matrix - Volume 95','Report','2026-05-12',245.50,NULL,NULL,3,2),(97,'Policy Intervention Strategy Evaluation Matrix - Volume 96','Book','2026-05-13',246.50,NULL,NULL,3,2),(98,'Policy Intervention Strategy Evaluation Matrix - Volume 97','Journal Article','2026-05-14',247.50,NULL,NULL,3,2),(99,'Policy Intervention Strategy Evaluation Matrix - Volume 98','Research Paper','2026-05-15',248.50,NULL,NULL,3,2),(100,'Policy Intervention Strategy Evaluation Matrix - Volume 99','Report','2026-05-16',249.50,NULL,NULL,3,2),(101,'Policy Intervention Strategy Evaluation Matrix - Volume 100','Book','2026-05-17',250.50,NULL,NULL,3,2);
/*!40000 ALTER TABLE `api_publication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_publisher`
--

DROP TABLE IF EXISTS `api_publisher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_publisher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_publisher`
--

LOCK TABLES `api_publisher` WRITE;
/*!40000 ALTER TABLE `api_publisher` DISABLE KEYS */;
INSERT INTO `api_publisher` VALUES (1,'ResearchGate'),(2,'UP-Diliman-National College of Public Administration and Governance (NCPAG)');
/*!40000 ALTER TABLE `api_publisher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add publisher',7,'add_publisher'),(26,'Can change publisher',7,'change_publisher'),(27,'Can delete publisher',7,'delete_publisher'),(28,'Can view publisher',7,'view_publisher'),(29,'Can add author',8,'add_author'),(30,'Can change author',8,'change_author'),(31,'Can delete author',8,'delete_author'),(32,'Can view author',8,'view_author'),(33,'Can add publication',9,'add_publication'),(34,'Can change publication',9,'change_publication'),(35,'Can delete publication',9,'delete_publication'),(36,'Can view publication',9,'view_publication');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(8,'api','author'),(9,'api','publication'),(7,'api','publisher'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-05-27 02:03:08.353649'),(2,'auth','0001_initial','2026-05-27 02:03:09.684931'),(3,'admin','0001_initial','2026-05-27 02:03:09.967092'),(4,'admin','0002_logentry_remove_auto_add','2026-05-27 02:03:09.978911'),(5,'admin','0003_logentry_add_action_flag_choices','2026-05-27 02:03:09.990266'),(6,'contenttypes','0002_remove_content_type_name','2026-05-27 02:03:10.187934'),(7,'auth','0002_alter_permission_name_max_length','2026-05-27 02:03:10.316525'),(8,'auth','0003_alter_user_email_max_length','2026-05-27 02:03:10.345577'),(9,'auth','0004_alter_user_username_opts','2026-05-27 02:03:10.360239'),(10,'auth','0005_alter_user_last_login_null','2026-05-27 02:03:10.459227'),(11,'auth','0006_require_contenttypes_0002','2026-05-27 02:03:10.464975'),(12,'auth','0007_alter_validators_add_error_messages','2026-05-27 02:03:10.478126'),(13,'auth','0008_alter_user_username_max_length','2026-05-27 02:03:10.604336'),(14,'auth','0009_alter_user_last_name_max_length','2026-05-27 02:03:10.721996'),(15,'auth','0010_alter_group_name_max_length','2026-05-27 02:03:10.751911'),(16,'auth','0011_update_proxy_permissions','2026-05-27 02:03:10.770216'),(17,'auth','0012_alter_user_first_name_max_length','2026-05-27 02:03:10.887919'),(18,'sessions','0001_initial','2026-05-27 02:03:10.957438'),(19,'api','0001_initial','2026-05-27 02:04:55.023806');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27  4:38:38
