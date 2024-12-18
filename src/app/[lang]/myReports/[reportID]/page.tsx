import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { redirect } from "next/navigation";
import { getDictionary } from "@/get-dictionary";
import ReportDetails from "@/components/reportDetails/reportDetails";

export default async function MyReports({
    params: { lang, reportID },
}: {
    params: { lang: Locale; reportID: string };
}) {
    // Get authentication session
    const session = await auth();
    if (!session) {
        return redirect(`/${lang}/login`);
    }

    // Get dictionary for translations
    const dictionary = await getDictionary(lang);

    // Fetch report data using TRPC
    const data = await api.reportDetails.getReportDetails({ reportID });

    // Error handling
    if (!data) {
        return <div>Report not found</div>;
    }

    // Transform report data
    const transformedReport = {
        ...data,
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
