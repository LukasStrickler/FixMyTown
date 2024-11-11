import { relations } from "drizzle-orm";
import {
    index,
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";
import { users } from "./users";
import { status } from "./status";
import { reports } from "./reports";

export const protocolls = createTable(
    "protocolls",
    {
        id: int("id").primaryKey(),
        time: int("time", { mode: "timestamp" }).notNull(),
        reportId: int("reportId").references(() => reports.id),
        userId: text("userId", { length: 255 }).notNull().references(() => users.id),
        statusId: int("statusId").references(() => status.id),
        comment: text("comment"),
    },
    (protocolls) => ({
        userIdIndex: index("userIdIndex").on(protocolls.userId),
        statusIdIndex: index("statusIdIndex").on(protocolls.statusId),
    })
)

export const protocollsRelations = relations(protocolls, ({ one }) => ({
    user: one(users, {
        fields: [protocolls.userId],
        references: [users.id],
        relationName: "protocollsToUsers",
    }),
    status: one(status, {
        fields: [protocolls.statusId],
        references: [status.id],
        relationName: "protocollsToStatus",
    }),
    reports: one(reports, {
        fields: [protocolls.reportId],
        references: [reports.id],
        relationName: "protocollsToReports",
    }),
}));