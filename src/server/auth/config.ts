import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend"

import { db } from "@/server/db";
import { accounts } from "@/server/db/schema/accounts";
import { users } from "@/server/db/schema/users";
import { verificationTokens } from "@/server/db/schema/verificationTokens";
import { sessions } from "@/server/db/schema/sessions";

import { env } from "@/env";
import { Adapter } from "@auth/core/adapters";

type UserRole = "USER" | "WORKER" | "ADMIN";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            role: UserRole;
        } & DefaultSession["user"];
    }

    interface User {
        // ...other properties
        role: UserRole;
    }
}


const drizzleAdapter = DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
}) as Adapter;

/** * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
    providers: [
        Resend({
            apiKey: env.RESEND_API_KEY,
            from: "no-reply@fixmy.town"
        }),
    ],
    adapter: drizzleAdapter,
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
                role: user.role,
            },
        }),
        // signIn: ({ profile }) => {
        //   // if (profile?.email?.endsWith("@example.com")) {
        //   //   return false;
        //   // }
        //   // Add more conditions if needed
        //   // if (someOtherCondition) {
        //   //   return false;
        //   // }
        //   return true; // Allow sign in for all other cases
        // },
    },
} satisfies NextAuthConfig;
