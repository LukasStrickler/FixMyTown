import { createTRPCRouter, workerProcedure, userProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from "@/server/db";
import { reports } from "@/server/db/schema/reports";
import { TRPCError } from "@trpc/server";
import { pictures } from "@/server/db/schema/pictures";
import { protocolls } from "@/server/db/schema/protocoll";

export const reportsDetailsRouter = createTRPCRouter({
    forWorker: workerProcedure.input(z.object({
        reportID: z.string(),
    })).query(async ({ input }) => {
        const { reportID } = input;


        const report = await db.query.reports.findFirst({
            where: eq(reports.id, parseInt(reportID)),
        })

        if (!report) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' });
        }

        const { prio, ...reportWithoutPriority } = report;


        const images = await db.query.pictures.findMany({
            where: eq(pictures.reportId, report.id),
        })
        const imagesProcessed = images.map((image) => ({
            key: image.id,
        }))


        const protocollData = await db.query.protocolls.findMany({
            where: eq(protocolls.reportId, report.id),
        })

        const protocollDataProcessed = protocollData.map((protocoll) => ({
            timestamp: protocoll.time,
            status: protocoll.statusId,
            comment: protocoll.comment,
            userId: protocoll.userId
        }))


        return {
            report: { ...reportWithoutPriority, prio },
            images: imagesProcessed,
            protocolls: protocollDataProcessed,
        };
    }),

    forCallingAsUser: userProcedure.input(z.object({
        reportID: z.string(),
    })).query(async ({ input }) => {
        const { reportID } = input;


        const report = await db.query.reports.findFirst({
            where: eq(reports.id, parseInt(reportID)),
        })

        if (!report) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' });
        }

        const images = await db.query.pictures.findMany({
            where: eq(pictures.reportId, report.id),
        })
        const imagesProcessed = images.map((image) => ({
            key: image.id,
        }))


        const protocollData = await db.query.protocolls.findMany({
            where: eq(protocolls.reportId, report.id),
        })

        const protocollDataProcessed = protocollData.map((protocoll) => ({
            timestamp: protocoll.time,
            status: protocoll.statusId,
            comment: protocoll.comment,
            userId: protocoll.userId
        }))


        return {
            report: report,
            images: imagesProcessed,
            protocolls: protocollDataProcessed,
        };
    }),
});