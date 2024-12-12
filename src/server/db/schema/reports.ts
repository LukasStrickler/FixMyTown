import { relations } from "drizzle-orm";
import {
    int,
    text,
    real,
    index,
} from "drizzle-orm/sqlite-core";

import { createTable } from "../table";
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
        name: text("name", { length: 255 }).notNull(),
        description: text("description", { length: 1000 }),
        latitude: real("latitude").notNull(),
        longitude: real("longitude").notNull(),
        locationDescription: text("location_description", { length: 500 }),
    },
    (reports) => ({
        typeIndex: index("type_idx").on(reports.type),
        prioIndex: index("prio_idx").on(reports.prio),
        locationDescriptionIndex: index("location_description_idx").on(reports.locationDescription),
    })
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
    pictures: many(pictures)
}))