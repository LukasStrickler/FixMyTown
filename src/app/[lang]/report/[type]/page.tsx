// External Libraries
import { notFound, redirect } from "next/navigation";

// Components
import { ReportingForm } from "@/components/reporting/reporting-form";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { auth } from "@/server/auth";
import { getDictionary } from "@/server/get-dictionary";

// Utils
import { logger } from "@/lib/logger";

// Page Configuration
export const dynamic = 'force-dynamic';
export const generateStaticParams = undefined;

// Constants
const VALID_REPORT_TYPES = {
    "defects-damage": "1",
    "defects": "1",
    "damage": "1",
    "contamination": "2",
    "parking-violation": "3",
    "parkingViolation": "3",
} as const;

type Props = {
    params: {
        lang: Locale;
        type: string;
    };
};

export default async function ReportPage({
    params: { lang, type },
}: Props) {
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
                        language={lang}
                    />
                </main>
            </HydrateClient>
        );
    } catch (error) {
        logger.error('Report type page error:', error);
        throw error;
    }
}