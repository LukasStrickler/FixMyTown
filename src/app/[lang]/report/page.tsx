// External Libraries
import { redirect } from "next/navigation";

// Components
import { ReportingForm } from "@/components/reporting/reporting-form";
import { HydrateClient } from "@/trpc/server";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { auth } from "@/server/auth";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
    params: { lang: Locale };
};

export default async function DefectsDamages({
    params: { lang },
}: Props) {
    const session = await auth();
    if (!session) {
        return redirect(`/${lang}/login`);
    }

    const dictionary = await getDictionary(lang);

    return (
        <HydrateClient>
            <main className="container mx-auto p-4">
                <ReportingForm
                    dictionary={dictionary}
                    language={lang}
                />
            </main>
        </HydrateClient>
    );
}
