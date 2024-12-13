// fetches report data from the database based on the reportID slug
// shows ReportDetails component but with restrited access to the user

// only allows own reports to be viewed
//  shows error if not found / not authorized
// only allows some information to be shown
//  no priority information etc
// only allows some actions to be taken
//  delete only when in status 1

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

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <ReportDetails
                        dictionary={dictionary}
                        report={{
                            ...data,
                            protocolls: data.protocolls.map(protocol => ({
                                ...protocol,
                                status: protocol.status ?? 0 // Default to 0 if null
                            }))
                        }}
                        worker={false}
                    />
                </div>
            </main>
        </HydrateClient>
    );
}
