import { relations } from "drizzle-orm";
import {
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";
import { reports } from "./reports";

export const prios = createTable(
    "prios",
    {
        id: int("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description").notNull(),
        icon: text("icon").notNull(),
    }
)

export const priosRelations = relations(prios, ({ many }) => ({
    reports: many(reports),
}));
