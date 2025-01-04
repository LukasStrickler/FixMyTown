import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export const usersManagementRouter = createTRPCRouter({
    updateRole: adminProcedure
        .input(z.object({
            userId: z.string(),
            role: z.enum(['admin', 'worker', 'user']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { userId, role } = input;

            const updatedUser = await ctx.db
                .update(users)
                .set({ role })
                .where(eq(users.id, userId))
                .returning({ id: users.id, role: users.role });

            if (updatedUser.length === 0) {
                throw new Error("User not found or update failed");
            }

            return updatedUser[0];
        }),

});