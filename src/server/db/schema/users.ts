import { relations, sql } from "drizzle-orm";
import {
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "../table";
import { accounts } from "./accounts";
import { protocolls } from "./protocoll";

export const users = createTable("user", {
    id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    emailVerified: int("email_verified", {
        mode: "timestamp",
    }).default(sql`(unixepoch())`),
    image: text("image", { length: 255 }),
    role: text("role", { length: 255 }).default("user"),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    protocolls: many(protocolls),
}));

