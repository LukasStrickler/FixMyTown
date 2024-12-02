import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { notFound } from "next/navigation";
import { ReportingForm } from "@/components/reporting/reporting-form";
import { getDictionary } from "@/get-dictionary";

// Define valid report types with slug to ID mapping
const VALID_REPORT_TYPES = {
    "defects-damage": "1",      // Defekte und Schäden
    "defects": "1",            // Defekte und Schäden
    "damage": "1",             // Defekte und Schäden
    "contamination": "2",        // Verunreinigungen
    "parking-violation": "3",    // Parkverstöße
    "parkingViolation": "3",     // Parkverstöße
} as const;

type ReportSlug = keyof typeof VALID_REPORT_TYPES;

export default async function ReportPage({
    params: { lang, type },
}: {
    params: { lang: Locale; type: ReportSlug };
}) {
    // Check if the type exists in our valid report types
    if (!(type in VALID_REPORT_TYPES)) {
        notFound();
    }

    const reportId = VALID_REPORT_TYPES[type];
    const session = await auth();
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
}

// Optional: Generate static params for all valid report types
export function generateStaticParams() {
    return Object.keys(VALID_REPORT_TYPES).map((type) => ({
        type,
    }));
} 