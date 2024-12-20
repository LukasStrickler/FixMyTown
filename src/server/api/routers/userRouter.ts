import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter} from "../trpc";
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

});