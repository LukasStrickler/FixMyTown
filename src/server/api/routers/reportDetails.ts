import { createTRPCRouter, workerProcedure, userProcedure } from "../trpc";
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from "@/server/db";
import { reports } from "@/server/db/schema/reports";
import { TRPCError } from "@trpc/server";
import { pictures } from "@/server/db/schema/pictures";
import { protocolls } from "@/server/db/schema/protocoll";
import { users } from "@/server/db/schema/users";
import { getDictionary } from "@/get-dictionary";
import { sendChangeNotification } from "@/lib/sendChangeNotification";
import { env } from "@/env";

const STATUS_COLORS = {
    1: "#4169E1",
    2: "#FFA500",
    3: "#32CD32",
    4: "#FF0000",
} as const;

export const reportDetailsRouter = createTRPCRouter({

    getWorkerReportDetails: workerProcedure.input(z.object({
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

    getReportDetails: userProcedure.input(z.object({
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


            const report = await ctx.db.query.reports.findFirst({
                where: eq(reports.id, parseInt(reportId)),
            })

            if (!report) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' });
            }

            const initialProtocol = await ctx.db.query.protocolls.findFirst({
                where: and(
                    eq(protocolls.reportId, parseInt(reportId)),
                ),
                orderBy: (protocolls, { asc }) => [asc(protocolls.time)]
            })

            if (!initialProtocol) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Initial protocol not found' });
            }

            const initialUser = await ctx.db.query.users.findFirst({
                where: eq(users.id, initialProtocol?.userId)
            })

            if (!initialUser) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Initial user not found' });
            }

            const initialUserEmail = initialUser.email
            const initialUserName = initialUser.name

            // DICTIONARY-UPDATE: Add new language here
            const dictionariesDe = await getDictionary('de')
            const dictionariesEn = await getDictionary('en')

            const dictionaries = [dictionariesDe, dictionariesEn]

            await sendChangeNotification({
                firstName: initialUserName ?? "User",
                title: report.name,
                status: dictionariesDe.metadata.statuses[statusId as 1 | 2 | 3 | 4].name,
                status_color: STATUS_COLORS[statusId as 1 | 2 | 3 | 4],
                link: `${env.NEXTAUTH_URL}/myReports/${reportId}`,
                recipient: initialUserEmail,
                dictionaries,
            })

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