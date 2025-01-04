import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter, userProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { inArray } from 'drizzle-orm';
import { logger } from "@/lib/logger";
import type { DB } from "@/server/db";

// Types
type User = typeof users.$inferSelect;
type UserBasicInfo = Pick<User, 'id' | 'name'>;
type UserFullInfo = Pick<User, 'id' | 'name' | 'email' | 'emailVerified' | 'image' | 'role'>;

// Input validation schemas
const getUsersByIdsSchema = z.object({
    userIds: z.array(z.string())
});

// Helper functions
async function fetchUsersByIds(db: DB, userIds: string[]): Promise<User[]> {
    return db
        .select()
        .from(users)
        .where(
            userIds.length > 0
                ? inArray(users.id, userIds)
                : undefined
        )
        .all();
}

async function fetchAllUsers(db: DB): Promise<User[]> {
    return db.select().from(users).all();
}

export const usersListRouter = createTRPCRouter({
    getNamesByIds: userProcedure
        .input(getUsersByIdsSchema)
        .query(async ({ ctx, input }) => {
            try {
                const userData = await fetchUsersByIds(ctx.db, input.userIds);

                return userData.map((user): UserBasicInfo => ({
                    id: user.id,
                    name: user.name,
                }));
            } catch (error) {
                logger.error('Error fetching users by IDs:', error);
                throw new Error('Failed to fetch users');
            }
        }),

    getAll: adminProcedure
        .query(async ({ ctx }) => {
            try {
                const userData = await fetchAllUsers(ctx.db);

                return userData.map((user): UserFullInfo => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    image: user.image,
                    role: user.role,
                }));
            } catch (error) {
                logger.error('Error fetching all users:', error);
                throw new Error('Failed to fetch users');
            }
        }),
});