// External Libraries
import { type Metadata } from 'next';

// Components
import ReportDetails from "@/components/reportDetails/reportDetails";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";
import { userLevel } from '@/server/auth/roles';

// Providers
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";
import { RoleGuard } from '@/components/provider/RoleGuard';

type MetadataProps = {
    params: { lang: Locale; reportID: string }
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.components.reports.details.title + " | FixMyTown",
    };
}

type Props = {
    params: {
        lang: Locale;
        reportID: string;
    };
};

export default async function MyReports({
    params: { lang, reportID },
}: Props) {
    const dictionary = await getDictionary(lang);
    const data = await api.reports.details.forCallingAsUser({ reportID });

    if (!data) {
        return <div>{dictionary.pages.reportDetails.errorMessage}</div>;
    }

    return (
        <RoleGuard
            allowedRoles={userLevel}
            lang={lang}
            redirectTo="/login"
        >
            <HydrateClient>
                <main className="flex min-h-screen flex-col items-center justify-center">
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                        <ReportDetails
                            dictionary={dictionary}
                            report={{
                                ...data,
                                report: {
                                    ...data.report,
                                    createdAt: data.protocolls[0]?.timestamp ?? new Date(),
                                    updatedAt: data.protocolls[data.protocolls.length - 1]?.timestamp ?? new Date()
                                },
                                protocolls: data.protocolls.map(protocol => ({
                                    ...protocol,
                                    status: protocol.status ?? 0
                                }))
                            }}
                            worker={false}
                        />
                    </div>
                </main>
            </HydrateClient>
        </RoleGuard>
    );
}
