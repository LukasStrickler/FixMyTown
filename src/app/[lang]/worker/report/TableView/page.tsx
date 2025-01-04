// External Libraries
import { redirect } from "next/navigation";

// Components
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";
import type { ReportData } from "@/components/reporting/report";

// Providers
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
    params: { lang: Locale };
};

export default async function MyReports({
    params: { lang },
}: Props) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/${lang}/login`);
    }
    if (session.user.role !== "worker" && session.user.role !== "admin") {
        redirect(`/${lang}/`);
    }

    const { reports } = await api.reports.list.getAll() as { reports: ReportData[] };
    const dictionary = await getDictionary(lang);

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <ReportsTable
                    dictionary={dictionary}
                    reports={reports}
                    worker={true}
                />
            </main>
        </HydrateClient>
    );
}