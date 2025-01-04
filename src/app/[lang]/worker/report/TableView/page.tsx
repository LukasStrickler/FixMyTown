// External Libraries
import { type Metadata } from 'next';

// Components
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";
import { workerLevel } from '@/server/auth/roles';
import type { ReportData } from '@/components/reporting/report';

// Providers
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";
import { RoleGuard } from '@/components/provider/RoleGuard';


type MetadataProps = {
    params: { lang: Locale }
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.layout.navigation.workspaces.workerWorkspace.workerWorkspaceTitle + " | FixMyTown",
        description: dictionary.layout.navigation.workspaces.workerWorkspace.projects.reportTableView,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function MyReports({
    params: { lang },
}: Props) {
    const { reports } = await api.reports.list.getAll() as { reports: ReportData[] };
    const dictionary = await getDictionary(lang);

    return (
        <RoleGuard
            allowedRoles={workerLevel}
            lang={lang}
            redirectTo="/login"
        >
            <HydrateClient>
                <main className="flex min-h-screen flex-col items-center justify-center">
                    <ReportsTable
                        dictionary={dictionary}
                        reports={reports}
                        worker={true}
                    />
                </main>
            </HydrateClient>
        </RoleGuard>
    );
}