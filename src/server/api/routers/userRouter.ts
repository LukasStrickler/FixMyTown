import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter, userProcedure} from "../trpc";
import { z } from 'zod';
import { and, eq, isNull, lt } from 'drizzle-orm'; // Import eq for comparisons

export const userRouter = createTRPCRouter({
  updateRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['admin', 'worker', 'user']),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;

      // Update the user's role in the database
      const updatedUser = await ctx.db
        .update(users)
        .set({ role }) // Set the new role
        .where(eq(users.id, userId)) // Use eq for the condition
        .returning({ id: users.id, role: users.role }); // Return specific columns

      // Check if the update was successful
      if (updatedUser.length === 0) {
        throw new Error("User not found or update failed");
      }

      return updatedUser[0]; // Return the updated user object
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

    .query(async ({ ctx }) => {const userData = await ctx.db.select().from(users).all();
    
      return userData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
      }));}),

deleteUnNamedUsers: adminProcedure
      .mutation(async ({ ctx }) => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
        const deletedUsers = await ctx.db
          .delete(users)
          .where(
            and(
            isNull(users.name),
            lt(users.emailVerified, twentyFourHoursAgo))
            );

        }),  
});