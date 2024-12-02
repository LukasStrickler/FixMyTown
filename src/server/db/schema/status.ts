import { relations } from "drizzle-orm";
import {
    index,
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "../table";
import { protocolls } from "./protocoll";

export const status = createTable(
    "status",
    {
        id: int("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        icon: text("icon"),
    },
    (status) => ({
        icons: index("icons").on(status.icon),
        names: index("names").on(status.name),
    })
)

export const statusRelations = relations(status, ({ many }) => ({
    protocolls: many(protocolls),
}));