import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { ReportingForm } from "@/components/reporting/reporting-form";
import { getDictionary } from "@/get-dictionary";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DefectsDamages({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
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
                />
            </main>
        </HydrateClient>
    );
}
