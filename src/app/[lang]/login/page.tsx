// Components
import { LoginClient } from "./page-client";

// Types
import { type Locale } from "@/i18n-config";
import { type Metadata } from "next";

// Providers
import { getDictionary } from "@/server/get-dictionary";

type MetadataProps = {
    params: { lang: Locale };
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.login.title + " | FixMyTown",
        description: dictionary.pages.auth.login.description,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function LoginPage({
    params: { lang },
}: Props) {
    const dictionary = await getDictionary(lang);

    return <LoginClient dictionary={dictionary} />;
}