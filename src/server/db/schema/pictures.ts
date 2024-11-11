import { relations } from "drizzle-orm";
import {
    int,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";
import { reports } from "./reports";

export const pictures = createTable(
    "pictures",
    {
        id: int("id").primaryKey(),
        reportId: int("reportId", { mode: "number" }).notNull().references(() => reports.id),
        timestamp: int("timestamp", { mode: "timestamp" }).notNull(),
    }
)

export const picturesRelations = relations(pictures, ({ one }) => ({
    report: one(reports, {
        fields: [pictures.reportId],
        references: [reports.id],
        relationName: "picturesToReport"
    })
}));