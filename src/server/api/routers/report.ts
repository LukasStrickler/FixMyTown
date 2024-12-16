import { createTRPCRouter, userProcedure, workerProcedure } from "../trpc"
import { createReportSchema } from "@/components/reporting/report"
import { reports } from "@/server/db/schema/reports"
import { pictures } from "@/server/db/schema/pictures"
import { protocolls } from "@/server/db/schema/protocoll"
import { eq, inArray } from "drizzle-orm"
import { types } from "@/server/db/schema/types"

async function fetchReports(ctx: any, userId?: string) {
    try {
        let reportIds: number[] = [];
        if (userId) {
            const userReportIds = await ctx.db
                .select({ id: reports.id })
                .from(reports)
                .innerJoin(protocolls, eq(reports.id, protocolls.reportId))
                .where(eq(protocolls.userId, userId))
                .distinct();
            reportIds = userReportIds.map((r: { id: number }) => r.id);

            if (reportIds.length === 0) return { reports: [] };
        }

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
            .from(reports)
            .where(userId ? inArray(reports.id, reportIds) : undefined);

        if (rawReports.length === 0) return { reports: [] };

        const [allProtocolls, reportPictures] = await Promise.all([
            ctx.db
                .select()
                .from(protocolls)
                .where(inArray(protocolls.reportId, rawReports.map((r: { id: number }) => r.id)))
                .where(userId ? eq(protocolls.userId, userId) : undefined),
            ctx.db
                .select()
                .from(pictures)
                .where(inArray(pictures.reportId, rawReports.map((r: { id: number }) => r.id)))
        ]);

        // Create lookup maps for faster access
        const protocolsMap = new Map<number, typeof allProtocolls>();
        allProtocolls.forEach((p: typeof allProtocolls[number]) => {
            const existing = protocolsMap.get(p.reportId) ?? [];
            protocolsMap.set(p.reportId, [...existing, p]);
        });

        const picturesMap = new Map<number, typeof reportPictures>();
        reportPictures.forEach((p: typeof reportPictures[number]) => {
            const existing = picturesMap.get(p.reportId) ?? [];
            picturesMap.set(p.reportId, [...existing, p]);
        });

        // Format reports using the maps
        const formattedReports = rawReports.map((report: typeof rawReports[number]) => ({
            report: {
                id: report.id,
                name: report.name,
                description: report.description,
                latitude: report.latitude,
                longitude: report.longitude,
                locationDescription: report.locationDescription,
            },
            protocols: (protocolsMap.get(report.id) ?? [])
                .filter((p: typeof allProtocolls[number]) => p.statusId !== null)
                .map((p: typeof allProtocolls[number]) => ({
                    id: p.id,
                    time: p.time,
                    statusId: p.statusId!,
                    comment: p.comment
                })),
            pictures: (picturesMap.get(report.id) ?? [])
                .map((p: typeof reportPictures[number]) => ({
                    id: p.id,
                    timestamp: p.timestamp
                })),
            typeId: report.type,
            prioId: report.prio
        }));

        return { reports: formattedReports };
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw new Error('Failed to fetch reports');
    }
}

export const reportRouter = createTRPCRouter({
    create: userProcedure
        .input(createReportSchema)
        .mutation(async ({ ctx, input }) => {
            const report = await ctx.db.insert(reports)
                .values({
                    ...input,
                    prio: input.prio ?? 0
                })
                .returning({ id: reports.id });

            const reportId = report[0]?.id;

            if (reportId) {
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

                try {
                    await ctx.db.insert(protocolls).values({
                        time: new Date(),
                        reportId: reportId,
                        userId: ctx.session.user.id,
                        statusId: 1,
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

    getTypes: userProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select()
            .from(types);
    }),

    getUserReports: userProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session?.user?.id) {
                throw new Error("Unauthorized");
            }
            return fetchReports(ctx, ctx.session.user.id);
        }),

    getWorkerReports: workerProcedure
        .query(async ({ ctx }) => {
            return fetchReports(ctx);
        }),
})