import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { notFound, redirect } from "next/navigation";
import { ReportingForm } from "@/components/reporting/reporting-form";
import { getDictionary } from "@/get-dictionary";
import { auth } from "@/server/auth";
import { logger } from "@/lib/logger";

// Force dynamic rendering
export const dynamic = 'force-dynamic'
// Disable static generation
export const generateStaticParams = undefined

// Define valid report types with slug to ID mapping
const VALID_REPORT_TYPES = {
    "defects-damage": "1",
    "defects": "1",
    "damage": "1",
    "contamination": "2",
    "parking-violation": "3",
    "parkingViolation": "3",
} as const;

export default async function ReportPage({
    params: { lang, type },
}: {
    params: { lang: Locale; type: string };
}) {
    try {
        const session = await auth();
        if (!session) {
            return redirect(`/${lang}/login`);
        }

        // Type checking after receiving the parameter
        if (!type || !(type in VALID_REPORT_TYPES)) {
            return notFound();
        }

        const reportId = VALID_REPORT_TYPES[type as keyof typeof VALID_REPORT_TYPES];
        const dictionary = await getDictionary(lang);

        return (
            <HydrateClient>
                <main className="container mx-auto p-4">
                    <ReportingForm
                        dictionary={dictionary}
                        preselectedType={reportId}
                    />
                </main>
            </HydrateClient>
        );
    } catch (error) {
        logger.error('Report type page error:', error);
        throw error;
    }
}