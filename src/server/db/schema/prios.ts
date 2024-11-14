import { relations } from "drizzle-orm";
import {
    int,
    text,
    index,
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
    },
    (prios) => ({
        nameIndex: index("prios_name_idx").on(prios.name),
        iconIndex: index("prios_icon_idx").on(prios.icon)
    })
)

export const priosRelations = relations(prios, ({ many }) => ({
    reports: many(reports)
}));
