import { createTRPCRouter, userProcedure, workerProcedure } from "@/server/api/trpc"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { inArray } from "drizzle-orm"
import { eq, and, min } from "drizzle-orm"
import { logger } from "@/lib/logger"

export const reportsListRouter = createTRPCRouter({
    AllReportsOfCalling: userProcedure
        .query(async ({ ctx }) => {
            try {
                const userReports = await ctx.db
                    .select()
                    .from(reports)
                    .where(
                        inArray(
                            reports.id,
                            ctx.db
                                .select({ reportId: protocolls.reportId })
                                .from(protocolls)
                                .groupBy(protocolls.reportId)
                                .having(
                                    and(
                                        eq(protocolls.userId, ctx.session.user.id),
                                        eq(protocolls.time, min(protocolls.time))
                                    )
                                )
                        )
                    );

                if (userReports.length === 0) {
                    return { reports: [] };
                }

                const reportIds = userReports.map(r => r.id);

                // Get associated data in parallel with optimized queries
                const [reportProtocols, reportPictures] = await Promise.all([
                    ctx.db
                        .select()
                        .from(protocolls)
                        .where(inArray(protocolls.reportId, reportIds))
                        .orderBy(protocolls.time),
                    ctx.db
                        .select()
                        .from(pictures)
                        .where(inArray(pictures.reportId, reportIds))
                ]);

                const formattedReports = userReports.map(report => ({
                    report: {
                        id: report.id,
                        name: report.name,
                        description: report.description,
                        latitude: report.latitude,
                        longitude: report.longitude,
                        locationDescription: report.locationDescription,
                    },
                    protocols: reportProtocols
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
                logger.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        }),

    getAll: workerProcedure
        .query(async ({ ctx }) => {
            try {
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
                logger.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        }),
});