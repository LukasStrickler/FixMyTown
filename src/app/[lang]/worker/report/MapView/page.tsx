// shows map with all reports

// reports are color coded by status
// report icons are assigned by kind 
// size of icon is based on priority

// if clicked on a report, it shows popup with link to details page
// page contains legend with explanation of everything 

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import ReportMap from "@/components/ReportOverview/Map/report-map";
import { api } from "@/trpc/server"
import { getDictionary } from "@/get-dictionary";

export default async function MyReports({
    params: { lang },
}: {
    params: { lang: Locale };
}) {

    const session = await auth();
    const { reports } = await api.report.getWorkerReports();
    const dictionary = await getDictionary(lang)

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="w-full p-4">
                    <ReportMap reports={reports} dictionary={dictionary} worker={true} />
                </div>
            </main>
        </HydrateClient>
    );
}