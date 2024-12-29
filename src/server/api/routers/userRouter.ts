import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter, userProcedure } from "../trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm'; // Import eq for comparisons

export const userRouter = createTRPCRouter({
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

    updateUserName: userProcedure
    .input(z.object({
      name: z.string().regex(/^[a-zA-Z0-9 ]{1,50}$/, "Invalid name format"),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const userId = ctx.session?.user?.id;
  
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      const updatedUser = await ctx.db
        .update(users)
        .set({ name })
        .where(eq(users.id, userId))
        .returning({ id: users.id, name: users.name });
  
      if (updatedUser.length === 0) {
        throw new Error("User not found or update failed");
      }
  
      return updatedUser[0];
    }),  

  getUsers: adminProcedure
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

  deleteCallingUser: userProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new Error("User not found");
      }

      // not delete the user, simply remove their email and name
      // This is a soft delete to keep the user data for future reference but protect their privacy
      await ctx.db.update(users).set({ email: "", name: "" }).where(eq(users.id, userId));

      return { message: "User deleted" };
    }),

  updateCallingUserName: userProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      await ctx.db.update(users).set({ name }).where(eq(users.id, ctx.session.user.id));
      return { message: "Name updated" };
    }),
});
