import { users } from "@/server/db/schema/users";
import { adminProcedure, createTRPCRouter, workerProcedure, userProcedure } from "../trpc";
import { z } from 'zod';
import { eq } from 'drizzle-orm'; // Import eq for comparisons
import { db } from "@/server/db";
import { reports } from "@/server/db/schema/reports";
import { TRPCError } from "@trpc/server";
import { pictures } from "@/server/db/schema/pictures";
import { protocolls } from "@/server/db/schema/protocoll";

export const reportDetailsRouter = createTRPCRouter({

    getReportDetails: userProcedure.input(z.object({
        reportID: z.string(),
    })).query(async ({ ctx, input }) => {
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
        }))


        return {
            report: reportWithoutPriority,
            images: imagesProcessed,
            protocolls: protocollDataProcessed,
        };
    }),


    getReportWorkerReportDetails: workerProcedure.input(z.object({
        reportID: z.string(),
    })).query(async ({ ctx, input }) => {
        const { reportID } = input;
    }),

    addProtocoll: workerProcedure
        .input(z.object({
            reportId: z.string(),
            statusId: z.number(),
            comment: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { reportId, statusId, comment } = input;

            const protocol = await ctx.db.insert(protocolls)
                .values({
                    time: new Date(),
                    reportId: parseInt(reportId),
                    userId: ctx.session.user.id,
                    statusId: statusId,
                    comment: comment,
                })
                .returning();

            return protocol[0];
        }),
})