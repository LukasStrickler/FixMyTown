// External Libraries
import { type Metadata } from 'next';

// Components
import { HydrateClient } from "@/trpc/server";
import MapViewClient from "./page-client";

// Types
import { type Locale } from "@/i18n-config";
import { workerLevel } from '@/server/auth/roles';

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
        description: dictionary.layout.navigation.workspaces.workerWorkspace.projects.reportMapView,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function MapView({
    params: { lang },
}: Props) {
    const dictionary = await getDictionary(lang);
    const { reports } = await api.reports.list.getAll();

    return (
        <RoleGuard
            allowedRoles={workerLevel}
            lang={lang}
            redirectTo="/login"
        >
            <HydrateClient>
                <MapViewClient
                    reports={reports}
                    dictionary={dictionary}
                />
            </HydrateClient>
        </RoleGuard>
    );
}