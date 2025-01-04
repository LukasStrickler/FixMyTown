// External Libraries
import { redirect } from "next/navigation";

// Components
import ReportDetails from "@/components/reportDetails/reportDetails";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
    params: {
        lang: Locale;
        reportID: string;
    };
};

export default async function MyReports({
    params: { lang, reportID },
}: Props) {
    // Get authentication session
    const session = await auth();
    if (!session) {
        return redirect(`/${lang}/login`);
    }

    // Get dictionary for translations
    const dictionary = await getDictionary(lang);

    // Fetch report data using TRPC
    const data = await api.reports.details.forCallingAsUser({ reportID });

    // Error handling
    if (!data) {
        return <div>{dictionary.pages.reportDetails.errorMessage}</div>;
    }

    // Transform report data
    const transformedReport = {
        ...data,
        report: {
            ...data.report,
            createdAt: data.protocolls[0]?.timestamp ?? new Date(),
            updatedAt: data.protocolls[data.protocolls.length - 1]?.timestamp ?? new Date()
        },
        protocolls: data.protocolls.map(protocol => ({
            ...protocol,
            status: protocol.status ?? 0
        }))
    };

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <ReportDetails
                        dictionary={dictionary}
                        report={transformedReport}
                        worker={false}
                    />
                </div>
            </main>
        </HydrateClient>
    );
}
