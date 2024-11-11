CREATE TABLE `fixmytown_protocolls` (
	`id` integer PRIMARY KEY NOT NULL,
	`time` integer NOT NULL,
	`userId` text(255) NOT NULL,
	`statusId` integer,
	`comment` text,
	FOREIGN KEY (`userId`) REFERENCES `fixmytown_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `fixmytown_status`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fixmytown_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text
);
--> statement-breakpoint
CREATE INDEX `userIdIndex` ON `fixmytown_protocolls` (`userId`);--> statement-breakpoint
CREATE INDEX `statusIdIndex` ON `fixmytown_protocolls` (`statusId`);