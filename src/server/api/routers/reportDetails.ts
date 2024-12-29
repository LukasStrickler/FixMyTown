import {createTRPCRouter, workerProcedure, userProcedure } from "../trpc";
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
    })).query(async ({input }) => {
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
            report: { ...reportWithoutPriority, prio },
            images: imagesProcessed,
            protocolls: protocollDataProcessed,
        };
    }),

    addProtocoll: workerProcedure
        .input(z.object({
            reportId: z.string(),
            statusId: z.number(),
            comment: z.string(),
            prio: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { reportId, statusId, comment, prio } = input;

            if (prio !== undefined) {
                await ctx.db.update(reports)
                    .set({ prio })
                    .where(eq(reports.id, parseInt(reportId)));
            }

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

    updatePriority: workerProcedure
        .input(z.object({
            reportId: z.string(),
            prio: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { reportId, prio } = input;

            await ctx.db.update(reports)
                .set({ prio })
                .where(eq(reports.id, parseInt(reportId)));
        }),
})