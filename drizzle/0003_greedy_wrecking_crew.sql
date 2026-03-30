CREATE TABLE `system_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`username` varchar(64),
	`acao` varchar(64) NOT NULL,
	`entidade` varchar(64),
	`entidade_id` varchar(64),
	`detalhes` text,
	`ip` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transferencia_itens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transferencia_id` int NOT NULL,
	`patrimonio_id` int,
	`patrimonio` int NOT NULL,
	`descricao` text,
	`tipo` varchar(64),
	`observacao` text,
	CONSTRAINT `transferencia_itens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transferencias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero_protocolo` varchar(32) NOT NULL,
	`setor_origem` varchar(255) NOT NULL,
	`setor_destino` varchar(255) NOT NULL,
	`responsavel_id` int,
	`responsavel_nome` varchar(128),
	`responsavel_cargo` varchar(128),
	`responsavel_id_funcional` varchar(32),
	`observacao` text,
	`status` enum('rascunho','emitida','concluida','cancelada') NOT NULL DEFAULT 'rascunho',
	`data_emissao` timestamp,
	`created_by` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transferencias_id` PRIMARY KEY(`id`),
	CONSTRAINT `transferencias_numero_protocolo_unique` UNIQUE(`numero_protocolo`)
);
--> statement-breakpoint
ALTER TABLE `app_users` ADD `cargo` varchar(128);--> statement-breakpoint
ALTER TABLE `app_users` ADD `id_funcional` varchar(32);--> statement-breakpoint
ALTER TABLE `app_users` ADD `setor` varchar(128);--> statement-breakpoint
ALTER TABLE `app_users` ADD `email` varchar(255);--> statement-breakpoint
ALTER TABLE `patrimonio_items` ADD `andar` varchar(64);