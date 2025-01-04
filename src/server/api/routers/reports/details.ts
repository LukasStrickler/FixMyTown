import { createTRPCRouter, workerProcedure, userProcedure } from "@/server/api/trpc";
import { z } from 'zod';
import { logger } from "@/lib/logger";
import {
    getReportById,
    getReportImages,
    getReportProtocols,
    validateReportOwnership,
    processReportDetails
} from "@/server/api/lib/reportHelpers";
import { type ProcessedImage, type ProcessedProtocol } from "@/components/reporting/report";

// Input validation schema
const reportIdSchema = z.object({
    reportID: z.string(),
});

export const reportsDetailsRouter = createTRPCRouter({
    forWorker: workerProcedure
        .input(reportIdSchema)
        .query(async ({ ctx, input }) => {
            try {
                const report = await getReportById(ctx.db, input.reportID);
                const [images, protocols] = await Promise.all([
                    getReportImages(ctx.db, report.id),
                    getReportProtocols(ctx.db, report.id)
                ]);

                const { prio, ...reportWithoutPriority } = report;
                return processReportDetails(
                    { ...reportWithoutPriority, prio },
                    images,
                    protocols
                );
            } catch (error) {
                logger.error('Error fetching report details:', error);
                throw error;
            }
        }),

    forCallingAsUser: userProcedure
        .input(reportIdSchema)
        .query(async ({ ctx, input }) => {
            try {
                const report = await getReportById(ctx.db, input.reportID);

                // Validate user ownership
                await validateReportOwnership(ctx.db, report.id, ctx.session.user.id);

                const [images, protocols] = await Promise.all([
                    getReportImages(ctx.db, report.id),
                    getReportProtocols(ctx.db, report.id)
                ]);



                return {
                    report: {
                        ...report,
                        prio: 0
                    },
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
            } catch (error) {
                logger.error('Error fetching report details:', error);
                throw error;
            }
        }),
});