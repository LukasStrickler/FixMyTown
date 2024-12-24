import { createTRPCRouter, publicProcedure } from "../trpc";
import { status } from "@/server/db/schema/status";

export const statusRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.query.status.findMany();
    }),
}); 