ALTER TABLE `fixmytown_post` ADD `created_by` text(255) NOT NULL REFERENCES fixmytown_user(id);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `fixmytown_post` (`created_by`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/