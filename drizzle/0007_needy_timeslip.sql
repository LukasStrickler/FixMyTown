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
CREATE TABLE `fixmytown_reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` integer NOT NULL,
	`prio` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`latitude` integer,
	`longitude` integer,
	`location_description` text,
	FOREIGN KEY (`type`) REFERENCES `fixmytown_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prio`) REFERENCES `fixmytown_prios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `fixmytown_protocolls` ADD `reportId` integer REFERENCES fixmytown_reports(id);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/