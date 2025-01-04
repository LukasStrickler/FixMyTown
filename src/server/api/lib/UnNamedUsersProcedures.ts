"use server";
import { users } from "@/server/db/schema/users";
import { and, isNull, lt } from "drizzle-orm";
import { db } from "../../db";

export async function deleteUnNamedUsers() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const deletedUsers = await db
    .update(users)
    .set({ email: "", name: "" })
    .where(
      and(
        isNull(users.name),
        lt(users.emailVerified, twentyFourHoursAgo)
      )
    )
    .returning();

  return { deletedCount: deletedUsers.length };
}