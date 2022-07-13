-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.8-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for katalog_obuce
CREATE DATABASE IF NOT EXISTS `katalog_obuce` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `katalog_obuce`;

-- Dumping structure for table katalog_obuce.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.administrator: ~1 rows (approximately)
REPLACE INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(10, 'miljana', '$2b$11$9qhHL7obM8xrjOtPmqdFauO6K2d.R69o8ALpsxbTKf8lSpMi7WGKu', 1);

-- Dumping structure for table katalog_obuce.article
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL DEFAULT '0',
  `category_id` int(10) unsigned NOT NULL DEFAULT 0,
  `description` text NOT NULL,
  `is_promoted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('available','hidden') NOT NULL DEFAULT 'available',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.article: ~12 rows (approximately)
REPLACE INTO `article` (`article_id`, `title`, `category_id`, `description`, `is_promoted`, `created_at`, `status`, `is_active`) VALUES
	(92, 'Sandale 3r5543', 32, 'Brend - OPPOSITE; Šifra  modela - L81559; Materijal lice -Tekstil; Materijal postava - Tekstil pamuk; Đon - tpg', 0, '2022-07-13 10:30:00', 'available', 1),
	(94, 'Sandale 6es4d3', 32, 'Brend - OPPOSITE; Šifra  modela - LJSN436; Materijal lice Koza; Materijal postava - Koza ; Đon - tpg', 0, '2022-07-13 10:33:10', 'available', 1),
	(95, 'Cipele 3fw4r3', 40, 'Brend - OPPOSITE; Šifra  modela - LSDGG36; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 10:49:12', 'available', 1),
	(96, 'Patike 343safe', 33, 'Brend - OPPOSITE; Šifra  modela - LKKDH36; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:06:10', 'available', 1),
	(97, 'Patike 3ge4fe', 33, 'Brend - OPPOSITE; Šifra  modela - LSDGG36; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:07:43', 'available', 1),
	(98, 'Papuce 3k4fe', 34, 'Brend - OPPOSITE; Šifra  modela - LSDGG36; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:12:32', 'available', 1),
	(99, 'Patike ds4e35e', 37, 'Brend - OPPOSITE; Šifra  modela - 432rjw6; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:19:28', 'available', 1),
	(100, 'Patike dhfg35e', 37, 'Brend - OPPOSITE; Šifra  modela - 644w6; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:21:07', 'available', 1),
	(101, 'Papuce d45335e', 38, 'Brend - OPPOSITE; Šifra  modela - 644w6; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:22:57', 'available', 1),
	(102, 'Papuce gh445e', 38, 'Brend - OPPOSITE; Šifra  modela - rt56w6; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:23:48', 'available', 1),
	(103, 'Cipele 431sad3', 39, 'Bren4dew3d - OPPOSITE; Šifra  modela - 36; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:27:40', 'available', 1),
	(104, 'Cipele 65d4ad3', 39, 'Bren4dew3d - OPPOSITE; Šifra  modela - 36f32f; Materijal lice - Tekstil; Materijal postava - Tekstil; Đon - tpg', 0, '2022-07-13 11:29:21', 'available', 1);

-- Dumping structure for table katalog_obuce.article_colors
CREATE TABLE IF NOT EXISTS `article_colors` (
  `article_colors_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `color_id` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`article_colors_id`),
  KEY `fk_article_colors_article_id` (`article_id`),
  KEY `fk_article_colors_color_id` (`color_id`),
  CONSTRAINT `fk_article_colors_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_article_colors_color_id` FOREIGN KEY (`color_id`) REFERENCES `color` (`color_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.article_colors: ~27 rows (approximately)
REPLACE INTO `article_colors` (`article_colors_id`, `article_id`, `color_id`, `is_active`) VALUES
	(6, 92, 4, 1),
	(7, 92, 1, 1),
	(8, 93, 4, 1),
	(9, 93, 2, 1),
	(10, 94, 4, 1),
	(11, 94, 2, 1),
	(49, 95, 4, 1),
	(50, 95, 3, 1),
	(61, 96, 3, 1),
	(62, 96, 4, 1),
	(63, 97, 3, 1),
	(64, 97, 4, 1),
	(65, 98, 4, 1),
	(66, 98, 3, 1),
	(69, 99, 1, 1),
	(70, 99, 2, 1),
	(71, 100, 1, 1),
	(72, 100, 2, 1),
	(73, 101, 1, 1),
	(74, 101, 2, 1),
	(75, 102, 2, 1),
	(76, 102, 3, 1),
	(77, 103, 4, 1),
	(78, 103, 3, 1),
	(81, 104, 1, 1),
	(82, 104, 2, 1),
	(83, 104, 3, 1);

-- Dumping structure for table katalog_obuce.article_material
CREATE TABLE IF NOT EXISTS `article_material` (
  `article_material_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `material_id` int(10) unsigned NOT NULL DEFAULT 0,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`article_material_id`),
  KEY `fk_article_material_article_id` (`article_id`),
  KEY `fk_article_material_material_id` (`material_id`),
  CONSTRAINT `fk_article_material_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_article_material_material_id` FOREIGN KEY (`material_id`) REFERENCES `material` (`material_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.article_material: ~13 rows (approximately)
REPLACE INTO `article_material` (`article_material_id`, `material_id`, `article_id`) VALUES
	(10, 6, 92),
	(11, 6, 93),
	(12, 5, 94),
	(13, 6, 95),
	(14, 6, 96),
	(15, 4, 97),
	(16, 4, 98),
	(17, 2, 99),
	(18, 3, 100),
	(19, 2, 101),
	(20, 4, 102),
	(21, 3, 103),
	(22, 3, 104);

-- Dumping structure for table katalog_obuce.article_price
CREATE TABLE IF NOT EXISTS `article_price` (
  `article_price_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `price` decimal(10,2) unsigned NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`article_price_id`),
  KEY `fk_article_price_article_id` (`article_id`),
  CONSTRAINT `fk_article_price_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.article_price: ~13 rows (approximately)
REPLACE INTO `article_price` (`article_price_id`, `article_id`, `price`, `created_at`) VALUES
	(95, 92, 23.00, '2022-07-13 10:30:00'),
	(96, 93, 23.00, '2022-07-13 10:31:29'),
	(97, 94, 21.00, '2022-07-13 10:33:10'),
	(98, 95, 44.00, '2022-07-13 10:49:12'),
	(99, 96, 43.00, '2022-07-13 11:06:10'),
	(100, 97, 23.00, '2022-07-13 11:07:43'),
	(101, 98, 23.00, '2022-07-13 11:12:32'),
	(102, 99, 23.00, '2022-07-13 11:19:28'),
	(103, 100, 23.00, '2022-07-13 11:21:07'),
	(104, 101, 12.00, '2022-07-13 11:22:57'),
	(105, 102, 34.00, '2022-07-13 11:23:48'),
	(106, 103, 22.00, '2022-07-13 11:27:40'),
	(107, 104, 13.00, '2022-07-13 11:29:21');

-- Dumping structure for table katalog_obuce.article_sizes
CREATE TABLE IF NOT EXISTS `article_sizes` (
  `article_sizes_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `size_id` int(10) unsigned NOT NULL DEFAULT 0,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`article_sizes_id`) USING BTREE,
  KEY `fk_article_sizes_article_id` (`article_id`),
  KEY `fk_article_sizes_size_id` (`size_id`),
  CONSTRAINT `fk_article_sizes_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_article_sizes_size_id` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.article_sizes: ~26 rows (approximately)
REPLACE INTO `article_sizes` (`article_sizes_id`, `size_id`, `article_id`) VALUES
	(57, 1, 92),
	(58, 4, 92),
	(59, 2, 93),
	(60, 1, 93),
	(61, 2, 94),
	(62, 1, 94),
	(65, 3, 95),
	(66, 2, 95),
	(67, 3, 96),
	(68, 2, 96),
	(69, 3, 97),
	(70, 2, 97),
	(71, 3, 98),
	(72, 2, 98),
	(73, 1, 99),
	(74, 2, 99),
	(77, 1, 100),
	(83, 2, 100),
	(84, 2, 101),
	(87, 1, 101),
	(88, 2, 102),
	(99, 1, 102),
	(100, 4, 103),
	(105, 3, 103),
	(106, 4, 104),
	(107, 3, 104);

-- Dumping structure for table katalog_obuce.category
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  `parent_category_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_image_path` (`image_path`),
  KEY `fk_category_parent_category_id` (`parent_category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.category: ~9 rows (approximately)
REPLACE INTO `category` (`category_id`, `name`, `image_path`, `parent_category_id`) VALUES
	(30, 'Zenska obuca', '/static/categories/zenska-obuca.png', NULL),
	(31, 'Muska obuca', '/static/categories/muska-obuca.png', NULL),
	(32, 'Sandale', '/static/categories/sandale.png', 30),
	(33, 'Patike', '/static/categories/patike.png', 30),
	(34, 'Papuce', '/static/categories/papuce.png', 30),
	(37, 'Patike', '/static/categories/patike-m.png', 31),
	(38, 'Papuce', '/static/categories/papuce-m.png', 31),
	(39, 'Cipele', '/static/categories/cipele-m.png', 31),
	(40, 'Cipele', '/static/categories/cipele.png', 30);

-- Dumping structure for table katalog_obuce.color
CREATE TABLE IF NOT EXISTS `color` (
  `color_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`color_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.color: ~4 rows (approximately)
REPLACE INTO `color` (`color_id`, `name`, `is_active`) VALUES
	(1, 'plava', 1),
	(2, 'bela', 1),
	(3, 'crna', 1),
	(4, 'braon', 1);

-- Dumping structure for table katalog_obuce.color_sizes
CREATE TABLE IF NOT EXISTS `color_sizes` (
  `color_sizes_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `color_id` int(10) unsigned NOT NULL DEFAULT 0,
  `size_id` int(10) unsigned NOT NULL DEFAULT 0,
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`color_sizes_id`),
  KEY `fk_color_sizes_article_id` (`article_id`),
  KEY `FK_color_sizes_color` (`color_id`),
  KEY `FK_color_sizes_size` (`size_id`),
  CONSTRAINT `FK_color_sizes_color` FOREIGN KEY (`color_id`) REFERENCES `color` (`color_id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_color_sizes_size` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_color_sizes_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.color_sizes: ~52 rows (approximately)
REPLACE INTO `color_sizes` (`color_sizes_id`, `article_id`, `color_id`, `size_id`, `quantity`, `created_at`) VALUES
	(137, 92, 1, 1, 21, '2022-07-13 10:30:00'),
	(138, 92, 1, 4, 17, '2022-07-13 10:30:00'),
	(139, 92, 4, 1, 33, '2022-07-13 10:30:00'),
	(140, 92, 4, 4, 15, '2022-07-13 10:30:00'),
	(141, 93, 2, 2, 21, '2022-07-13 10:31:29'),
	(142, 93, 2, 1, 11, '2022-07-13 10:31:29'),
	(143, 93, 4, 1, 11, '2022-07-13 10:31:29'),
	(144, 93, 4, 2, 11, '2022-07-13 10:31:29'),
	(145, 94, 2, 2, 21, '2022-07-13 10:33:10'),
	(146, 94, 2, 1, 11, '2022-07-13 10:33:10'),
	(147, 94, 4, 1, 11, '2022-07-13 10:33:10'),
	(148, 94, 4, 2, 11, '2022-07-13 10:33:10'),
	(149, 95, 3, 3, 23, '2022-07-13 10:49:12'),
	(150, 95, 3, 2, 23, '2022-07-13 10:49:12'),
	(151, 95, 4, 2, 21, '2022-07-13 10:49:12'),
	(152, 95, 4, 3, 14, '2022-07-13 10:49:12'),
	(153, 96, 3, 3, 23, '2022-07-13 11:06:10'),
	(154, 96, 3, 2, 23, '2022-07-13 11:06:10'),
	(155, 96, 4, 2, 21, '2022-07-13 11:06:10'),
	(156, 96, 4, 3, 14, '2022-07-13 11:06:10'),
	(157, 97, 3, 3, 3, '2022-07-13 11:07:43'),
	(158, 97, 3, 2, 23, '2022-07-13 11:07:43'),
	(159, 97, 4, 2, 22, '2022-07-13 11:07:43'),
	(160, 97, 4, 3, 12, '2022-07-13 11:07:43'),
	(161, 98, 3, 3, 3, '2022-07-13 11:12:32'),
	(162, 98, 3, 2, 23, '2022-07-13 11:12:32'),
	(163, 98, 4, 2, 22, '2022-07-13 11:12:32'),
	(164, 98, 4, 3, 12, '2022-07-13 11:12:32'),
	(165, 99, 1, 1, 31, '2022-07-13 11:19:28'),
	(166, 99, 1, 2, 22, '2022-07-13 11:19:28'),
	(167, 99, 2, 1, 32, '2022-07-13 11:19:28'),
	(168, 99, 2, 2, 42, '2022-07-13 11:19:28'),
	(169, 100, 1, 1, 11, '2022-07-13 11:21:07'),
	(170, 100, 1, 2, 12, '2022-07-13 11:21:07'),
	(171, 100, 2, 1, 11, '2022-07-13 11:21:07'),
	(172, 100, 2, 2, 11, '2022-07-13 11:21:07'),
	(173, 101, 1, 1, 11, '2022-07-13 11:22:57'),
	(174, 101, 1, 2, 12, '2022-07-13 11:22:57'),
	(175, 101, 2, 1, 11, '2022-07-13 11:22:57'),
	(176, 101, 2, 2, 11, '2022-07-13 11:22:57'),
	(177, 102, 2, 1, 11, '2022-07-13 11:23:48'),
	(178, 102, 2, 2, 12, '2022-07-13 11:23:48'),
	(179, 102, 3, 1, 11, '2022-07-13 11:23:48'),
	(180, 102, 3, 2, 11, '2022-07-13 11:23:48'),
	(181, 103, 4, 4, 26, '2022-07-13 11:27:40'),
	(182, 103, 4, 4, 22, '2022-07-13 11:27:40'),
	(183, 103, 3, 3, 22, '2022-07-13 11:27:40'),
	(184, 103, 3, 3, 12, '2022-07-13 11:27:40'),
	(185, 104, 1, 4, 26, '2022-07-13 11:29:21'),
	(186, 104, 1, 4, 22, '2022-07-13 11:29:21'),
	(187, 104, 2, 3, 22, '2022-07-13 11:29:21'),
	(188, 104, 3, 3, 12, '2022-07-13 11:29:21');

-- Dumping structure for table katalog_obuce.material
CREATE TABLE IF NOT EXISTS `material` (
  `material_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.material: ~6 rows (approximately)
REPLACE INTO `material` (`material_id`, `name`) VALUES
	(1, 'foam'),
	(2, 'rubber'),
	(3, 'plastic'),
	(4, 'synthetic'),
	(5, 'leather'),
	(6, 'textile');

-- Dumping structure for table katalog_obuce.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL DEFAULT 0,
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_article_id` (`article_id`),
  CONSTRAINT `fk_photo_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.photo: ~17 rows (approximately)
REPLACE INTO `photo` (`photo_id`, `article_id`, `image_path`) VALUES
	(92, 93, 'static/uploads/2022/07/41df8555-04b1-4290-9560-7c6b8eaff6cc-ls81502-blk-37w.ebp'),
	(102, 99, 'static/uploads/2022/07/f2c3ab82-96de-4cdf-aee1-c122e0c36d43-1.jpg'),
	(103, 100, 'static/uploads/2022/07/3b210613-0592-4da1-92aa-93ad1be19563-4.jpg'),
	(104, 101, 'static/uploads/2022/07/12423988-6ab9-492d-8bb8-d4b4550c148d-768469-003_800_1120px.jpg'),
	(105, 102, 'static/uploads/2022/07/1566e591-6f40-409d-9986-d011cb63ad76-Papuce-muske-superdry2021-001.jpg'),
	(106, 103, 'static/uploads/2022/07/ff6d9443-c3a9-4186-9b89-deb266f3cef7-Bata-muske-cipele-893-9362-01.jpg'),
	(107, 104, 'static/uploads/2022/07/d14cad1c-c6ae-46cc-9fda-ea3433e93bf8-Muske-cipele-Casual-140-135-08-Plava-1-1.jpg'),
	(108, 96, 'static/uploads/2022/07/6883ce72-bca3-4af4-8ce0-209052c53b60-775430-044_800_1120px.jpg'),
	(109, 97, 'static/uploads/2022/07/acf2601d-1a7e-4955-b078-207d96f2216f-772225-2202_800_1120px.jpg'),
	(110, 98, 'static/uploads/2022/07/f53126de-f310-419f-8063-a97c284c79c7-765042-91_4_800_1120px.jpg'),
	(111, 92, 'static/uploads/2022/07/2454db44-d193-4c41-a047-e84e59145a9d-765045-317_800_1120px.jpg'),
	(112, 94, 'static/uploads/2022/07/1adb41d6-576e-4108-9d56-0d2e7b5b4f84-765530-Pelle-bianco_800_1120px.jpg'),
	(114, 95, 'static/uploads/2022/07/8699fcd4-12e6-4878-ac6a-67da480b9c1a-zenske-cipele-guess-maia-FLMAI3LEL-BRONZ-3.jpg');

-- Dumping structure for table katalog_obuce.size
CREATE TABLE IF NOT EXISTS `size` (
  `size_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table katalog_obuce.size: ~4 rows (approximately)
REPLACE INTO `size` (`size_id`, `name`, `is_active`) VALUES
	(1, '37', 1),
	(2, '38', 1),
	(3, '39', 1),
	(4, '40', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
