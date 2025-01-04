import { type Locale } from "@/i18n-config";
import { HydrateClient } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import MapViewClient from "./map-view-client";

export default async function MapView({
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