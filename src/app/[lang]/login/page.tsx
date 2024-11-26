import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { LoginClient } from "./login-client";
import { type Metadata } from "next";

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.auth.login.title + " | FixMyTown",
        description: dictionary.auth.login.description,
    };
}
export default async function LoginPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const dictionary = await getDictionary(lang);

    return <LoginClient dictionary={dictionary} />;
}