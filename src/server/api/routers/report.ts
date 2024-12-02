import { createTRPCRouter, userProcedure } from "../trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"

export const reportRouter = createTRPCRouter({
    create: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(reports).values(input)
        }),

    getTypes: userProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.types.findMany()
    }),

    getPrios: userProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.prios.findMany()
    }),
})