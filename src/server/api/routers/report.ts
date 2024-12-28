import { createTRPCRouter, userProcedure, workerProcedure } from "../trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { eq, inArray } from "drizzle-orm"

export const reportRouter = createTRPCRouter({
    create: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            // Insert the report
            const report = await ctx.db.insert(reports)
                .values({
                    ...input,
                    prio: input.prio ?? 0
                })
                .returning({ id: reports.id });

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
                        console.error("Error inserting pictures:", error);
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
                    console.error("Error creating initial protocol:", error);
                    throw new Error("form.generalError");
                }
            }

            if (!reportId) {
                throw new Error("form.generalError");
            }

            return reportId;
        }),

    getUserReports: userProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session?.user?.id) {
                throw new Error("Unauthorized");
            }

            try {
                // Get all reports first
                const rawReports = await ctx.db
                    .select({
                        id: reports.id,
                        name: reports.name,
                        description: reports.description,
                        latitude: reports.latitude,
                        longitude: reports.longitude,
                        locationDescription: reports.locationDescription,
                        type: reports.type,
                        prio: reports.prio,
                    })
                    .from(reports);

                const reportIds = rawReports.map(r => r.id);

                const userProtocolls = await ctx.db
                    .select()
                    .from(protocolls)
                    .where(eq(protocolls.userId, ctx.session.user.id));

                const reportPictures = await ctx.db
                    .select()
                    .from(pictures)
                    .where(inArray(pictures.reportId, reportIds));

                const formattedReports = rawReports.map(report => ({
                    report: {
                        id: report.id,
                        name: report.name,
                        description: report.description,
                        latitude: report.latitude,
                        longitude: report.longitude,
                        locationDescription: report.locationDescription,
                    },
                    protocols: userProtocolls
                        .filter(p => p.reportId === report.id && p.statusId !== null)
                        .map(p => ({
                            id: p.id,
                            time: p.time,
                            statusId: p.statusId!,
                            comment: p.comment
                        })),
                    pictures: reportPictures
                        .filter(p => p.reportId === report.id)
                        .map(p => ({
                            id: p.id,
                            timestamp: p.timestamp
                        })),
                    typeId: report.type,
                    prioId: report.prio
                }));

                return {
                    reports: formattedReports,
                };
            } catch (error) {
                console.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        }),

    getWorkerReports: workerProcedure
        .query(async ({ ctx }) => {
            try {
                // Get all reports
                const rawReports = await ctx.db
                    .select({
                        id: reports.id,
                        name: reports.name,
                        description: reports.description,
                        latitude: reports.latitude,
                        longitude: reports.longitude,
                        locationDescription: reports.locationDescription,
                        type: reports.type,
                        prio: reports.prio,
                    })
                    .from(reports);

                const reportIds = rawReports.map(r => r.id);

                // Get all protocols for these reports (not filtered by user)
                const allProtocolls = await ctx.db
                    .select()
                    .from(protocolls)
                    .where(inArray(protocolls.reportId, reportIds));

                const reportPictures = await ctx.db
                    .select()
                    .from(pictures)
                    .where(inArray(pictures.reportId, reportIds));

                const formattedReports = rawReports.map(report => ({
                    report: {
                        id: report.id,
                        name: report.name,
                        description: report.description,
                        latitude: report.latitude,
                        longitude: report.longitude,
                        locationDescription: report.locationDescription,
                    },
                    protocols: allProtocolls
                        .filter(p => p.reportId === report.id && p.statusId !== null)
                        .map(p => ({
                            id: p.id,
                            time: p.time,
                            statusId: p.statusId!,
                            comment: p.comment
                        })),
                    pictures: reportPictures
                        .filter(p => p.reportId === report.id)
                        .map(p => ({
                            id: p.id,
                            timestamp: p.timestamp
                        })),
                    typeId: report.type,
                    prioId: report.prio
                }));

                return {
                    reports: formattedReports,
                };
            } catch (error) {
                console.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        }),
})