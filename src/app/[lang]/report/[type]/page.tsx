// External Libraries
import { notFound } from "next/navigation";
import { type Metadata } from 'next';

// Components
import { ReportingForm } from "@/components/reporting/reporting-form";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";
import { userLevel } from '@/server/auth/roles';

// Providers
import { getDictionary } from "@/server/get-dictionary";
import { RoleGuard } from '@/components/provider/RoleGuard';

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

type MetadataProps = {
    params: { lang: Locale; type: string }
};

export async function generateMetadata({
    params: { lang, type }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    const reportType = VALID_REPORT_TYPES[type as keyof typeof VALID_REPORT_TYPES];
    return {
        title: dictionary.metadata.types[reportType].name + " | FixMyTown",
        description: dictionary.metadata.types[reportType].description,
    };
}

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
        // Type checking after receiving the parameter
        if (!type || !(type in VALID_REPORT_TYPES)) {
            return notFound();
        }

        const reportId = VALID_REPORT_TYPES[type as keyof typeof VALID_REPORT_TYPES];
        const dictionary = await getDictionary(lang);

        return (
            <RoleGuard
                allowedRoles={userLevel}
                lang={lang}
                redirectTo="/login"
            >
                <HydrateClient>
                    <main className="container mx-auto p-4">
                        <ReportingForm
                            dictionary={dictionary}
                            preselectedType={reportId}
                            language={lang}
                        />
                    </main>
                </HydrateClient>
            </RoleGuard>
        );
    } catch (error) {
        logger.error('Report type page error:', error);
        throw error;
    }
}