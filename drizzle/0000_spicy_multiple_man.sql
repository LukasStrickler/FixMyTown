CREATE TABLE `fixmytown_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `fixmytown_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_pictures` (
	`id` integer PRIMARY KEY NOT NULL,
	`reportId` integer NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`reportId`) REFERENCES `fixmytown_reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_prios` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fixmytown_protocolls` (
	`id` integer PRIMARY KEY NOT NULL,
	`time` integer NOT NULL,
	`reportId` integer,
	`userId` text(255) NOT NULL,
	`statusId` integer,
	`comment` text,
	FOREIGN KEY (`reportId`) REFERENCES `fixmytown_reports`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `fixmytown_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `fixmytown_status`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` integer NOT NULL,
	`prio` integer NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(1000),
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`location_description` text(500),
	FOREIGN KEY (`type`) REFERENCES `fixmytown_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prio`) REFERENCES `fixmytown_prios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `fixmytown_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text
);
--> statement-breakpoint
CREATE TABLE `fixmytown_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fixmytown_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`image` text(255),
	`role` text(255) DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE `fixmytown_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `fixmytown_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `report_id_idx` ON `fixmytown_pictures` (`reportId`);--> statement-breakpoint
CREATE INDEX `timestamp_idx` ON `fixmytown_pictures` (`timestamp`);--> statement-breakpoint
CREATE INDEX `prios_name_idx` ON `fixmytown_prios` (`name`);--> statement-breakpoint
CREATE INDEX `prios_icon_idx` ON `fixmytown_prios` (`icon`);--> statement-breakpoint
CREATE INDEX `userIdIndex` ON `fixmytown_protocolls` (`userId`);--> statement-breakpoint
CREATE INDEX `statusIdIndex` ON `fixmytown_protocolls` (`statusId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `fixmytown_reports` (`type`);--> statement-breakpoint
CREATE INDEX `prio_idx` ON `fixmytown_reports` (`prio`);--> statement-breakpoint
CREATE INDEX `location_description_idx` ON `fixmytown_reports` (`location_description`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `fixmytown_session` (`userId`);--> statement-breakpoint
CREATE INDEX `icons` ON `fixmytown_status` (`icon`);--> statement-breakpoint
CREATE INDEX `names` ON `fixmytown_status` (`name`);--> statement-breakpoint
CREATE INDEX `types_name_idx` ON `fixmytown_types` (`name`);--> statement-breakpoint
CREATE INDEX `types_icon_idx` ON `fixmytown_types` (`icon`);