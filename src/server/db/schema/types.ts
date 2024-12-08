import { relations } from "drizzle-orm";
import {
    int,
    text,
    index,
} from "drizzle-orm/sqlite-core";

import { createTable } from "../table";
import { reports } from "./reports";

export const types = createTable(
    "types",
    {
        id: int("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description").notNull(),
        icon: text("icon").notNull(),
    },
    (types) => ({
        nameIndex: index("types_name_idx").on(types.name),
        iconIndex: index("types_icon_idx").on(types.icon)
    })
)

export const typesRelations = relations(types, ({ many }) => ({
    reports: many(reports)
}));