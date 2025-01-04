import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { logger } from "@/lib/logger";
import type { DB } from "@/server/db";

// Types
type User = typeof users.$inferSelect;
type UpdateRoleResult = {
    id: string;
    role: string;
};

// Input validation schemas
const updateRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(['admin', 'worker', 'user']),
});

// Helper functions
async function updateUserRole(db: DB, userId: string, role: User['role']): Promise<UpdateRoleResult> {
    const updatedUser = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, userId))
        .returning({ id: users.id, role: users.role });

    if (!updatedUser?.[0]) {
        throw new Error("User not found or update failed");
    }

    return { id: updatedUser[0].id, role: updatedUser[0].role! };
}

export const usersManagementRouter = createTRPCRouter({
    updateRole: adminProcedure
        .input(updateRoleSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                return await updateUserRole(ctx.db, input.userId, input.role);
            } catch (error) {
                logger.error('Error updating user role:', error);
                throw new Error('Failed to update user role');
            }
        }),
});