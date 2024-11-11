import { relations } from "drizzle-orm";
import {
    int,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";
import { protocolls } from "./protocoll";
import { pictures } from "./pictures";
import { types } from "./types";
import { prios } from "./prios";

export const reports = createTable(
    "reports",
    {
        id: int("id").primaryKey(),
        type: int("type", { mode: "number" }).notNull().references(() => types.id),
        prio: int("prio", { mode: "number" }).notNull().references(() => prios.id),
        name: text("name").notNull(),
        description: text("description"),
        latitude: int("latitude", { mode: "number" }),
        longitude: int("longitude", { mode: "number" }),
        locationDescription: text("location_description")
    }
)

export const reportsRelations = relations(reports, ({ one, many }) => ({
    type: one(types, {
        fields: [reports.type],
        references: [types.id],
        relationName: "reports_to_types"
    }),
    prio: one(prios, {
        fields: [reports.prio],
        references: [prios.id],
        relationName: "reports_to_prios"
    }),
    protocolls: many(protocolls),
    pictures: many(pictures),
}))