import { createTRPCRouter, userProcedure } from "../trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"

export const reportRouter = createTRPCRouter({
    create: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            // Insert the report

            console.log("input", input)

            const report = await ctx.db.insert(reports)
                .values({
                    ...input,
                    prio: input.prio ?? 0
                })
                .returning({ id: reports.id });

            const reportId = report[0]?.id;

            if (reportId && input.imageIds && input.imageIds.length > 0) {
                try {
                    await ctx.db.insert(pictures).values(
                        input.imageIds.map((id: string) => ({
                            id: id,
                            reportId: reportId,
                            timestamp: new Date()
                        }))
                    ).onConflictDoUpdate({
                        target: pictures.id,
                        set: {
                            reportId: reportId,
                        }
                    });
                } catch (error) {
                    console.error("Error inserting pictures:", error);
                    throw new Error("form.uploadError");
                }
            }

            if (!reportId) {
                throw new Error("form.generalError");
            }

            return reportId;
        }),

    getTypes: userProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.types.findMany()
    }),

})