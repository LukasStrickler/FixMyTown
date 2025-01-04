import { createTRPCRouter, userProcedure } from "@/server/api/trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { getDictionary } from "@/server/get-dictionary";
import type { Locale } from "@/i18n-config"
import { sendCreationNotification } from "@/lib/sendCreationNotification"
import { env } from "@/env"
import { logger } from "@/lib/logger"

export const reportsCreateRouter = createTRPCRouter({
    base: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            // Insert the report
            const report = await ctx.db.insert(reports)
                .values({
                    ...input,
                    prio: input.prio ?? 0
                })
                .returning({ id: reports.id, name: reports.name });

            const reportId = report[0]?.id;

            if (reportId) {
                // Handle image uploads
                if (input.imageIds && input.imageIds.length > 0) {
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
                        logger.error("Error inserting pictures:", error);
                        throw new Error("form.uploadError");
                    }
                }

                // Create initial protocol with "new" status (assuming status ID 1 is "new")
                try {
                    await ctx.db.insert(protocolls).values({
                        time: new Date(),
                        reportId: reportId,
                        userId: ctx.session.user.id,
                        statusId: 1, // Assuming 1 is the "new" status
                        comment: null
                    });
                } catch (error) {
                    logger.error("Error creating initial protocol:", error);
                    throw new Error("form.generalError");
                }
            }

            if (!reportId) {
                throw new Error("form.generalError");
            }
            const dictionary = await getDictionary(input.language as Locale);

            await sendCreationNotification({
                firstName: ctx.session.user.name ?? "User",
                title: report[0]!.name,
                link: `${env.NEXTAUTH_URL}/${input.language}/myReports/${reportId}`,
                dictionary,
                recipient: ctx.session.user.email ?? "",
            });

            return reportId;
        }),
});