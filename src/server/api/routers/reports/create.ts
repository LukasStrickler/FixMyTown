import { createTRPCRouter, userProcedure } from "@/server/api/trpc"
import { createReportSchema, type CreateReportInput } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { getDictionary } from "@/server/get-dictionary"
import type { Locale } from "@/i18n-config"
import { sendCreationNotification } from "@/lib/sendCreationNotification"
import { env } from "@/env"
import { logger } from "@/lib/logger"
import type { Dictionary } from "@/dictionaries/dictionary"
import type { DB } from "@/server/db"

// Types
type NewReport = Pick<CreateReportInput, 'name'> & { id: number }
type User = { name?: string | null; email?: string | null }

// Helper functions
async function handleImageUploads(db: DB, imageIds: string[], reportId: number) {
    try {
        await db.insert(pictures)
            .values(
                imageIds.map(id => ({
                    id,
                    reportId,
                    timestamp: new Date()
                }))
            )
            .onConflictDoUpdate({
                target: pictures.id,
                set: { reportId }
            });
    } catch (error) {
        logger.error("Error inserting pictures:", error);
        throw new Error("form.uploadError");
    }
}

async function createInitialProtocol(db: DB, reportId: number, userId: string) {
    try {
        await db.insert(protocolls).values({
            time: new Date(),
            reportId,
            userId,
            statusId: 1, // "new" status
            comment: null
        });
    } catch (error) {
        logger.error("Error creating initial protocol:", error);
        throw new Error("form.generalError");
    }
}

async function sendNotification(
    user: User,
    report: NewReport,
    language: string,
    dictionary: Dictionary
) {
    await sendCreationNotification({
        firstName: user.name ?? "User",
        title: report.name,
        link: `${env.NEXTAUTH_URL}/${language}/myReports/${report.id}`,
        dictionary,
        recipient: user.email ?? "",
    });
}

export const reportsCreateRouter = createTRPCRouter({
    base: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const [newReport] = await ctx.db.insert(reports)
                    .values({
                        ...input,
                        prio: input.prio ?? 0
                    })
                    .returning({
                        id: reports.id,
                        name: reports.name
                    });

                if (!newReport?.id) {
                    throw new Error("Failed to create report");
                }

                if (input.imageIds?.length) {
                    await handleImageUploads(ctx.db, input.imageIds, newReport.id);
                }

                await createInitialProtocol(ctx.db, newReport.id, ctx.session.user.id);

                const dictionary = await getDictionary(input.language as Locale);
                await sendNotification(
                    ctx.session.user,
                    newReport,
                    input.language,
                    dictionary
                );

                return newReport.id;
            } catch (error) {
                logger.error("Error in report creation:", error);
                throw new Error("form.generalError");
            }
        }),
});