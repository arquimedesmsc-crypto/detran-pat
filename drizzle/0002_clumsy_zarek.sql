CREATE TABLE `app_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`display_name` varchar(128) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`last_login` timestamp,
	CONSTRAINT `app_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `levantamento_anual` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ano` int NOT NULL,
	`patrimonio` int NOT NULL,
	`descricao` text NOT NULL,
	`setor` varchar(255),
	`local` varchar(255),
	`status` enum('localizado','nao_localizado','em_verificacao') NOT NULL DEFAULT 'em_verificacao',
	`tipo` enum('informatica','mobiliario','eletrodomestico','veiculo','outros') NOT NULL DEFAULT 'outros',
	`observacao` text,
	`responsavel` varchar(128),
	`data_registro` timestamp NOT NULL DEFAULT (now()),
	`created_by` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `levantamento_anual_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `levantamento_fotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levantamento_id` int NOT NULL,
	`url` varchar(1024) NOT NULL,
	`thumb_url` varchar(1024),
	`file_key` varchar(512) NOT NULL,
	`mime_type` varchar(64) DEFAULT 'image/jpeg',
	`tamanho_bytes` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `levantamento_fotos_id` PRIMARY KEY(`id`)
);
