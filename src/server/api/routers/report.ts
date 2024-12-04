import { createTRPCRouter, userProcedure } from "../trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { z } from "node_modules/zod/lib"
import { pictures } from "@/server/db/schema/pictures"

export const reportRouter = createTRPCRouter({
    create: userProcedure
        .input(createReportSchema.extend({
            imageIds: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Insert the report
            const report = await ctx.db.insert(reports)
                .values({
                    ...input,
                    prio: input.prio ?? 0
                })
                .returning({ id: reports.id });

            const reportId = report[0]?.id;

            if (reportId && input.imageIds) {
                // Map images to the report, overwrite if exists
                await ctx.db.insert(pictures).values(
                    input.imageIds.map((id) => ({
                        id: parseInt(id), // Convert string id to number
                        reportId: reportId,
                        timestamp: new Date()
                    }))
                ).onConflictDoUpdate({
                    target: pictures.id,
                    set: {
                        reportId: reportId,
                    }
                });
            }

            return reportId;
        }),
    registerImages: userProcedure
        .input(z.object({
            imageIds: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(pictures).values(
                input.imageIds.map((id) => ({
                    id: parseInt(id), // Convert string id to number
                    timestamp: new Date()
                }))
            )
        }),

    getTypes: userProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.types.findMany()
    }),

})