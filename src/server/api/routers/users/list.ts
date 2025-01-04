import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter, userProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { inArray } from 'drizzle-orm';

export const usersListRouter = createTRPCRouter({
    getNamesByIds: userProcedure
        .input(z.object({
            userIds: z.array(z.string())
        }))
        .query(async ({ ctx, input }) => {
            const { userIds } = input;
            const userData = await ctx.db
                .select()
                .from(users)
                .where(
                    userIds.length > 0
                        ? inArray(users.id, userIds)
                        : undefined
                )
                .all();

            return userData.map((user) => ({
                id: user.id,
                name: user.name,
            }));
        }),

    getAll: adminProcedure
        .query(async ({ ctx }) => {
            const userData = await ctx.db.select().from(users).all();
            return userData.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                role: user.role,
            }));
        }),
});