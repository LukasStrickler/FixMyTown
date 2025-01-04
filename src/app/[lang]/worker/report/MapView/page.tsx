// External Libraries
import { redirect } from "next/navigation";

// Components
import { HydrateClient } from "@/trpc/server";
import MapViewClient from "./page-client";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
    params: { lang: Locale };
};

export default async function MapView({
    params: { lang },
}: Props) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/${lang}/login`);
    }
    if (session.user.role !== "worker" && session.user.role !== "admin") {
        redirect(`/${lang}/`);
    }

    const dictionary = await getDictionary(lang);
    const { reports } = await api.report.getWorkerReports();

    return (
        <HydrateClient>
            <MapViewClient
                reports={reports}
                dictionary={dictionary}
            />
        </HydrateClient>
    );
}