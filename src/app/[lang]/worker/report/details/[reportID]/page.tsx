import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import ReportDetails from "@/components/reportDetails/reportDetails";
import { api } from "@/trpc/server"; // Import your TRPC API

export default async function ReportDetailsPage({
    params: { lang, reportID },
}: {
    params: { lang: Locale; reportID: string };
}) {
    // Get dictionary for translations
    const dictionary = await getDictionary(lang);

    // Fetch report data using TRPC
    const data = await api.reportDetails.getReportDetails({ reportID });

    // You might want to add error handling here
    if (!data) {
        return <div>Report not found</div>;
    }

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <ReportDetails
                        dictionary={dictionary}
                        report={{
                            ...data,
                            report: {
                                ...data.report,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                prio: data.report.prio ?? 0
                            },
                            protocolls: data.protocolls.map(protocol => ({
                                ...protocol,
                                status: protocol.status ?? 0 // Default to 0 if null
                            }))
                        }}
                        worker={true}
                    />
                </div>
            </main>
        </HydrateClient>
    );
}
