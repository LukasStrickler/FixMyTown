import { createTRPCRouter, publicProcedure } from "../trpc";

export const statusRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.query.status.findMany();
    }),
}); 