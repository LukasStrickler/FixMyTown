import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { getDictionary } from "@/server/get-dictionary";
import { redirect } from "next/navigation";
import type { ReportData } from "@/components/reporting/report";

export default async function MyReports({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/${lang}/login`);
    }
    if (session.user.role !== "worker" && session.user.role !== "admin") {
        redirect(`/${lang}/`);
    }

    const { reports } = await api.report.getWorkerReports() as { reports: ReportData[] };

    const dictionary = await getDictionary(lang);

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <ReportsTable dictionary={dictionary} reports={reports} worker={true} />
            </main>
        </HydrateClient>
    );
}