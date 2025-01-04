import { createTRPCRouter, userProcedure, workerProcedure } from "@/server/api/trpc"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { inArray, eq, and, min } from "drizzle-orm"
import { logger } from "@/lib/logger"
import type { ReportData } from "@/components/reporting/report"
import type { DB } from "@/server/db"

type Protocol = typeof protocolls.$inferSelect;
type Picture = typeof pictures.$inferSelect;
type Report = typeof reports.$inferSelect;

// Helper functions
async function fetchAssociatedData(ctx: { db: DB }, reportIds: number[]) {
    return Promise.all([
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
}

function formatReports(
    reports: Report[],
    protocols: Protocol[],
    pictures: Picture[]
): ReportData[] {
    return reports.map(report => ({
        report: {
            id: report.id,
            name: report.name,
            description: report.description,
            latitude: report.latitude,
            longitude: report.longitude,
            locationDescription: report.locationDescription,
            prio: report.prio
        },
        protocols: protocols
            .filter(p => p.reportId === report.id && p.statusId !== null)
            .map(p => ({
                id: p.id,
                time: p.time,
                statusId: p.statusId!,
                comment: p.comment
            })),
        pictures: pictures
            .filter(p => p.reportId === report.id)
            .map(p => ({
                id: p.id,
                timestamp: p.timestamp
            })),
        typeId: report.type,
        prioId: report.prio
    }));
}

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
                    return { reports: [] as ReportData[] };
                }

                const reportIds = userReports.map(r => r.id);
                const [reportProtocols, reportPictures] = await fetchAssociatedData(ctx, reportIds);
                const formattedReports = formatReports(userReports, reportProtocols, reportPictures);

                // Drop the prio field from the reports
                const reportsWithoutPrio = formattedReports.map(report => ({
                    ...report,
                    prio: undefined
                }));

                return { reports: reportsWithoutPrio };
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

                if (rawReports.length === 0) {
                    return { reports: [] as ReportData[] };
                }

                const reportIds = rawReports.map(r => r.id);
                const [allProtocolls, reportPictures] = await fetchAssociatedData(ctx, reportIds);
                const formattedReports = formatReports(rawReports, allProtocolls, reportPictures);

                return { reports: formattedReports };
            } catch (error) {
                logger.error('Error fetching reports:', error);
                throw new Error('Failed to fetch reports');
            }
        }),
});