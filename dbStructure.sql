-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Gegenereerd op: 31 mei 2017 om 13:21
-- Serverversie: 10.1.13-MariaDB
-- PHP-versie: 7.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eindwerk`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bill`
--

CREATE TABLE `bill` (
  `id` int(11) NOT NULL,
  `summary` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `account` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bills_paid_users`
--

CREATE TABLE `bills_paid_users` (
  `bill_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bills_unpaid_users`
--

CREATE TABLE `bills_unpaid_users` (
  `bill_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `calender`
--

CREATE TABLE `calender` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `flat`
--

CREATE TABLE `flat` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `widget_color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `header_color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `font_color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `background_image` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `number` int(11) NOT NULL,
  `zipcode` int(11) NOT NULL,
  `flat_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `grocery`
--

CREATE TABLE `grocery` (
  `id` int(11) NOT NULL,
  `item` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `invite`
--

CREATE TABLE `invite` (
  `id` int(11) NOT NULL,
  `recipient` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `invite_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `send_date` date NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  `inviter_id` int(11) DEFAULT NULL,
  `flat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `options_users`
--

CREATE TABLE `options_users` (
  `poll_option_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `picture`
--

CREATE TABLE `picture` (
  `id` int(11) NOT NULL,
  `image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `poll`
--

CREATE TABLE `poll` (
  `id` int(11) NOT NULL,
  `question` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `multiple` tinyint(1) NOT NULL,
  `until` datetime NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `poll_option`
--

CREATE TABLE `poll_option` (
  `id` int(11) NOT NULL,
  `poll_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `text`
--

CREATE TABLE `text` (
  `id` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `todo`
--

CREATE TABLE `todo` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `done` int(11) NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `flat_id` int(11) DEFAULT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `widget`
--

CREATE TABLE `widget` (
  `id` int(11) NOT NULL,
  `widget_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `visible` int(11) NOT NULL,
  `flat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `bills_paid_users`
--
ALTER TABLE `bills_paid_users`
  ADD PRIMARY KEY (`bill_id`,`user_id`),
  ADD KEY `IDX_CE909DB51A8C12F5` (`bill_id`),
  ADD KEY `IDX_CE909DB5A76ED395` (`user_id`);

--
-- Indexen voor tabel `bills_unpaid_users`
--
ALTER TABLE `bills_unpaid_users`
  ADD PRIMARY KEY (`bill_id`,`user_id`),
  ADD KEY `IDX_2A3519CA1A8C12F5` (`bill_id`),
  ADD KEY `IDX_2A3519CAA76ED395` (`user_id`);

--
-- Indexen voor tabel `calender`
--
ALTER TABLE `calender`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `flat`
--
ALTER TABLE `flat`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `grocery`
--
ALTER TABLE `grocery`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `invite`
--
ALTER TABLE `invite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C7E210D7B79F4F04` (`inviter_id`),
  ADD KEY `IDX_C7E210D7D3331C94` (`flat_id`);

--
-- Indexen voor tabel `options_users`
--
ALTER TABLE `options_users`
  ADD PRIMARY KEY (`poll_option_id`,`user_id`),
  ADD KEY `IDX_D5F6184A6C13349B` (`poll_option_id`),
  ADD KEY `IDX_D5F6184AA76ED395` (`user_id`);

--
-- Indexen voor tabel `picture`
--
ALTER TABLE `picture`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `poll`
--
ALTER TABLE `poll`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `poll_option`
--
ALTER TABLE `poll_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B68343EB3C947C0F` (`poll_id`);

--
-- Indexen voor tabel `text`
--
ALTER TABLE `text`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `todo`
--
ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`),
  ADD KEY `IDX_8D93D649D3331C94` (`flat_id`);

--
-- Indexen voor tabel `widget`
--
ALTER TABLE `widget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_85F91ED0D3331C94` (`flat_id`),
  ADD KEY `IDX_85F91ED0A76ED395` (`user_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `bill`
--
ALTER TABLE `bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT voor een tabel `calender`
--
ALTER TABLE `calender`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `flat`
--
ALTER TABLE `flat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT voor een tabel `grocery`
--
ALTER TABLE `grocery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT voor een tabel `invite`
--
ALTER TABLE `invite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT voor een tabel `picture`
--
ALTER TABLE `picture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT voor een tabel `poll`
--
ALTER TABLE `poll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT voor een tabel `poll_option`
--
ALTER TABLE `poll_option`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;
--
-- AUTO_INCREMENT voor een tabel `text`
--
ALTER TABLE `text`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT voor een tabel `todo`
--
ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT voor een tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT voor een tabel `widget`
--
ALTER TABLE `widget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;
--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `bills_paid_users`
--
ALTER TABLE `bills_paid_users`
  ADD CONSTRAINT `FK_CE909DB51A8C12F5` FOREIGN KEY (`bill_id`) REFERENCES `bill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CE909DB5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `bills_unpaid_users`
--
ALTER TABLE `bills_unpaid_users`
  ADD CONSTRAINT `FK_2A3519CA1A8C12F5` FOREIGN KEY (`bill_id`) REFERENCES `bill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2A3519CAA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `invite`
--
ALTER TABLE `invite`
  ADD CONSTRAINT `FK_C7E210D7B79F4F04` FOREIGN KEY (`inviter_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_C7E210D7D3331C94` FOREIGN KEY (`flat_id`) REFERENCES `flat` (`id`);

--
-- Beperkingen voor tabel `options_users`
--
ALTER TABLE `options_users`
  ADD CONSTRAINT `FK_D5F6184A6C13349B` FOREIGN KEY (`poll_option_id`) REFERENCES `poll_option` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D5F6184AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `poll_option`
--
ALTER TABLE `poll_option`
  ADD CONSTRAINT `FK_B68343EB3C947C0F` FOREIGN KEY (`poll_id`) REFERENCES `poll` (`id`);

--
-- Beperkingen voor tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_8D93D649D3331C94` FOREIGN KEY (`flat_id`) REFERENCES `flat` (`id`);

--
-- Beperkingen voor tabel `widget`
--
ALTER TABLE `widget`
  ADD CONSTRAINT `FK_85F91ED0A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_85F91ED0D3331C94` FOREIGN KEY (`flat_id`) REFERENCES `flat` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
