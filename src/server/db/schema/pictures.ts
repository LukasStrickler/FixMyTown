import { relations } from "drizzle-orm";
import {
    int,
    index,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";
import { reports } from "./reports";

export const pictures = createTable(
    "pictures",
    {
        id: int("id").primaryKey(),
        reportId: int("reportId", { mode: "number" }).notNull().references(() => reports.id),
        timestamp: int("timestamp", { mode: "timestamp" }).notNull(),
    },
    (pictures) => ({
        reportIdIndex: index("report_id_idx").on(pictures.reportId),
        timestampIndex: index("timestamp_idx").on(pictures.timestamp)
    })
)

export const picturesRelations = relations(pictures, ({ one }) => ({
    report: one(reports, {
        fields: [pictures.reportId],
        references: [reports.id],
        relationName: "pictures_to_reports"
    })
}));