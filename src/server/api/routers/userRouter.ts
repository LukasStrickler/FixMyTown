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
      name: z.string()
      .min(1, { message: "Name empty" })
          .transform(val => val.trim())
          .refine(val => val.length >= 3, { message: "Name to short" })
          .refine(val => val.length <= 50, { message: "Name to long" })
          .refine(val => /^[\p{L}\s]*$/u.test(val), { message: "Name contians forbidden chars" }),
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

    //TODO: make it so that it gets x id and  returns the users 
    getUserNames: userProcedure
    .query(async ({ ctx }) => {
      const userData = await ctx.db.select().from(users).all();
      return userData.map((user) => ({
        id: user.id,
        name: user.name,
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
