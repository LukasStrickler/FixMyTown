import {
    int,
    primaryKey,
    text,
} from "drizzle-orm/sqlite-core";

import { createTable } from "..";

export const verificationTokens = createTable(
    "verification_token",
    {
        identifier: text("identifier", { length: 255 }).notNull(),
        token: text("token", { length: 255 }).notNull(),
        expires: int("expires", { mode: "timestamp" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);
