import { TRPCError } from "@trpc/server";
import { eq, inArray, and, min } from 'drizzle-orm';
import type { DB } from "@/server/db";
import { reports } from "@/server/db/schema/reports";
import { pictures } from "@/server/db/schema/pictures";
import { protocolls } from "@/server/db/schema/protocoll";
import { type ProcessedImage, type ProcessedProtocol, type ReportData } from "@/components/reporting/report";

// Types
type Report = typeof reports.$inferSelect;
type Picture = typeof pictures.$inferSelect;
type Protocol = typeof protocolls.$inferSelect;

export async function getReportById(db: DB, reportId: string): Promise<Report> {
    const report = await db.query.reports.findFirst({
        where: eq(reports.id, parseInt(reportId)),
    });

    if (!report) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Report not found'
        });
    }

    return report;
}

export async function getReportImages(db: DB, reportId: number): Promise<Picture[]> {
    return db.query.pictures.findMany({
        where: eq(pictures.reportId, reportId),
    });
}

export async function getReportProtocols(db: DB, reportId: number): Promise<Protocol[]> {
    return db.query.protocolls.findMany({
        where: eq(protocolls.reportId, reportId),
    });
}

export async function validateReportOwnership(db: DB, reportId: number, userId: string): Promise<void> {
    const initialProtocol = await db.query.protocolls.findFirst({
        where: eq(protocolls.reportId, reportId),
        orderBy: (protocols) => [protocols.time],
    });

    if (!initialProtocol || initialProtocol.userId !== userId) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view this report'
        });
    }
}

export async function fetchAssociatedData(db: DB, reportIds: number[]) {
    return Promise.all([
        db.query.protocolls.findMany({
            where: inArray(protocolls.reportId, reportIds),
            orderBy: (p) => [p.time],
        }),
        db.query.pictures.findMany({
            where: inArray(pictures.reportId, reportIds),
        })
    ]);
}

export function formatReports(
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

export async function updateReportPriority(db: DB, reportId: string, prio: number): Promise<void> {
    await db.update(reports)
        .set({ prio })
        .where(eq(reports.id, parseInt(reportId)));
}

export async function getUserReportIds(db: DB, userId: string): Promise<number[]> {
    const result = await db
        .select({ reportId: protocolls.reportId })
        .from(protocolls)
        .groupBy(protocolls.reportId)
        .having(
            and(
                eq(protocolls.userId, userId),
                eq(protocolls.time, min(protocolls.time))
            )
        );

    return result
        .filter((r): r is { reportId: number } => r.reportId !== null)
        .map(r => r.reportId);
}

export function processReportDetails(
    report: Report,
    images: Picture[],
    protocols: Protocol[]
) {
    return {
        report,
        images: images.map((image): ProcessedImage => ({
            key: image.id,
        })),
        protocolls: protocols.map((protocol): ProcessedProtocol => ({
            timestamp: protocol.time,
            status: protocol.statusId,
            comment: protocol.comment,
            userId: protocol.userId
        }))
    };
} 