CREATE TABLE `patrimonio_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patrimonio` int NOT NULL,
	`descricao` text,
	`setor` varchar(255),
	`local` varchar(255),
	`data_incorporacao` date,
	`valor` decimal(12,2),
	`status` enum('localizado','nao_localizado') NOT NULL DEFAULT 'nao_localizado',
	`tipo` enum('informatica','mobiliario','eletrodomestico','veiculo','outros') NOT NULL DEFAULT 'outros',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patrimonio_items_id` PRIMARY KEY(`id`)
);
