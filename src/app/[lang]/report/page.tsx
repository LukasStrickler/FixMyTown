// External Libraries
import { type Metadata } from 'next';

// Components
import { ReportingForm } from "@/components/reporting/reporting-form";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";
import { userLevel } from '@/server/auth/roles';

// Providers
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
        title: dictionary.pages.landing.reportButton + " | FixMyTown",
        description: dictionary.metadata.types[1].description,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function DefectsDamages({
    params: { lang },
}: Props) {
    const dictionary = await getDictionary(lang);

    return (
        <RoleGuard
            allowedRoles={userLevel}
            lang={lang}
            redirectTo="/login"
        >
            <HydrateClient>
                <main className="container mx-auto p-4">
                    <ReportingForm
                        dictionary={dictionary}
                        language={lang}
                    />
                </main>
            </HydrateClient>
        </RoleGuard>
    );
}
