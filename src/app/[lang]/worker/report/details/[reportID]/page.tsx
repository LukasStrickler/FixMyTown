// Components
import ReportDetails from "@/components/reportDetails/reportDetails";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
    params: {
        lang: Locale;
        reportID: string;
    };
};

export default async function ReportDetailsPage({
    params: { lang, reportID },
}: Props) {
    const dictionary = await getDictionary(lang);

    const data = await api.reportDetails.getWorkerReportDetails({ reportID });

    if (!data) {
        return <div>{dictionary.pages.reportDetails.errorMessage}</div>;
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
