import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

import { env } from "@/env";

import { types } from "./schema/types"
import { prios } from "./schema/prios"
import { reports } from "./schema/reports";
import { accounts } from "./schema/accounts";
import { users } from "./schema/users";
import { sessions } from "./schema/sessions";
import { pictures } from "./schema/pictures";
import { protocolls } from "./schema/protocoll";
import { status } from "./schema/status";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ?? createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, {
  schema: {
    types,
    prios,
    reports,
    accounts,
    users,
    sessions,
    pictures,
    protocolls,
    status,
  }
});

export type Schema = {
  types: typeof types;
  prios: typeof prios;
  reports: typeof reports;
  accounts: typeof accounts;
  users: typeof users;
  sessions: typeof sessions;
  pictures: typeof pictures;
  protocolls: typeof protocolls;
  status: typeof status;
};

export type DB = LibSQLDatabase<Schema>; 