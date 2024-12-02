import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { DevPageClient } from "./dev-client";

export default async function DevPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const dictionary = await getDictionary(lang);

    return <DevPageClient />;
}
