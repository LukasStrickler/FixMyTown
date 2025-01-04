import { createTRPCRouter, workerProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { reports } from "@/server/db/schema/reports";
import { TRPCError } from "@trpc/server";
import { protocolls } from "@/server/db/schema/protocoll";
import { users } from "@/server/db/schema/users";
import { getDictionary } from "@/server/get-dictionary";
import { sendChangeNotification } from "@/lib/sendChangeNotification";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import type { DB } from "@/server/db";

// Types
type Report = typeof reports.$inferSelect;
type Protocol = typeof protocolls.$inferSelect;
type User = typeof users.$inferSelect;

// Input validation schemas
const addProtocollInput = z.object({
    reportId: z.string(),
    statusId: z.number(),
    comment: z.string(),
    prio: z.number().optional(),
});

const setPriorityInput = z.object({
    reportId: z.string(),
    prio: z.number(),
});

// Helper functions
async function getReportById(db: DB, reportId: string): Promise<Report> {
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

async function getInitialProtocol(db: DB, reportId: string): Promise<Protocol> {
    const initialProtocol = await db.query.protocolls.findFirst({
        where: and(
            eq(protocolls.reportId, parseInt(reportId)),
        ),
        orderBy: protocols => [protocols.time]
    });

    if (!initialProtocol) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Initial protocol not found'
        });
    }

    return initialProtocol;
}

async function getInitialUser(db: DB, userId: string): Promise<User> {
    const initialUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!initialUser) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Initial user not found'
        });
    }

    return initialUser;
}

async function updateReportPriority(db: DB, reportId: string, prio: number): Promise<void> {
    await db.update(reports)
        .set({ prio })
        .where(eq(reports.id, parseInt(reportId)));
}

async function createProtocol(db: DB, input: z.infer<typeof addProtocollInput>, userId: string): Promise<Protocol> {
    const [protocol] = await db.insert(protocolls)
        .values({
            time: new Date(),
            reportId: parseInt(input.reportId),
            userId: userId,
            statusId: input.statusId,
            comment: input.comment,
        })
        .returning();

    if (!protocol) {
        throw new Error('Failed to create protocol');
    }

    return protocol;
}

export const reportsUpdateRouter = createTRPCRouter({
    addProtocoll: workerProcedure
        .input(addProtocollInput)
        .mutation(async ({ ctx, input }) => {
            try {
                // Update priority if provided
                if (input.prio !== undefined) {
                    await updateReportPriority(ctx.db, input.reportId, input.prio);
                }

                // Get report and initial data
                const report = await getReportById(ctx.db, input.reportId);
                const initialProtocol = await getInitialProtocol(ctx.db, input.reportId);
                const initialUser = await getInitialUser(ctx.db, initialProtocol.userId);

                // Get dictionaries for notifications
                const [dictionariesDe, dictionariesEn] = await Promise.all([
                    getDictionary('de'),
                    getDictionary('en')
                ]);

                // Send notification
                await sendChangeNotification({
                    firstName: initialUser.name ?? "User",
                    title: report.name,
                    status: dictionariesDe.metadata.statuses[input.statusId as 1 | 2 | 3 | 4].name,
                    status_color: dictionariesDe.metadata.statuses[input.statusId as 1 | 2 | 3 | 4].color,
                    link: `${env.NEXTAUTH_URL}/myReports/${input.reportId}`,
                    recipient: initialUser.email,
                    dictionaries: [dictionariesDe, dictionariesEn],
                });

                // Create new protocol
                return createProtocol(ctx.db, input, ctx.session.user.id);
            } catch (error) {
                logger.error('Error updating report:', error);
                throw error;
            }
        }),

    setPriority: workerProcedure
        .input(setPriorityInput)
        .mutation(async ({ ctx, input }) => {
            try {
                await updateReportPriority(ctx.db, input.reportId, input.prio);
            } catch (error) {
                logger.error('Error setting priority:', error);
                throw new Error('Failed to update priority');
            }
        }),
});