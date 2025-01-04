import { users } from "@/server/db/schema/users";
import { createTRPCRouter, userProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { nameSchema } from "@/server/api/lib/name-schema";

export const usersProfileRouter = createTRPCRouter({
    updateNameOfCalling: userProcedure
        .input(z.object({ name: nameSchema }))
        .mutation(async ({ ctx, input }) => {
            const updatedUser = await ctx.db
                .update(users)
                .set({ name: input.name })
                .where(eq(users.id, ctx.session.user.id))
                .returning({ id: users.id, name: users.name });

            if (!updatedUser?.[0]) {
                throw new Error("User not found or update failed");
            }

            return { id: updatedUser[0].id, name: updatedUser[0].name! };
        }),

    deleteCalling: userProcedure
        .mutation(async ({ ctx }) => {
            // we do not delete the user, we just set the email and name to empty
            // this is to keep the user in the database for future reference and see their old data
            await ctx.db
                .update(users)
                .set({ email: "", name: "" })
                .where(eq(users.id, ctx.session.user.id));

            return { message: "User deleted" };
        }),
});