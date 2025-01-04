import { createTRPCRouter, workerProcedure, } from "@/server/api/trpc";
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { reports } from "@/server/db/schema/reports";
import { TRPCError } from "@trpc/server";
import { protocolls } from "@/server/db/schema/protocoll";
import { users } from "@/server/db/schema/users";
import { getDictionary } from "@/server/get-dictionary";
import { sendChangeNotification } from "@/lib/sendChangeNotification";
import { env } from "@/env";

export const reportsUpdateRouter = createTRPCRouter({
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
                status_color: dictionariesDe.metadata.statuses[statusId as 1 | 2 | 3 | 4].color,
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

    setPriority: workerProcedure
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