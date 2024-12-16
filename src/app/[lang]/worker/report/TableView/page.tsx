// shows table with all reports
// can sort by status, priority, kind, date
// can filter by status, priority, kind, date
// can click on a report to go to details page

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { getDictionary } from "@/get-dictionary";

export default async function MyReports({
    params: { lang },
}: {
    params: { lang: Locale };
}) {

    const session = await auth();
    const { reports } = await api.report.getWorkerReports();
    const dictionary = await getDictionary(lang);
    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <ReportsTable dictionary={dictionary} reports={reports} worker={true} />
            </main>
        </HydrateClient>
    );
}