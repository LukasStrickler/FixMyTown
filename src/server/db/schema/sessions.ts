import { relations } from "drizzle-orm";
import {
    index,
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "../table";
import { users } from "./users";

export const sessions = createTable(
    "session",
    {
        sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
        userId: text("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: int("expires", { mode: "timestamp" }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_userId_idx").on(session.userId),
    })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));