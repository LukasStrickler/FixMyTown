// External Libraries
import { redirect } from 'next/navigation';
import { type Metadata } from 'next';

// Components
import AccountClient from '@/app/[lang]/account/page-client';

// Types
import { type Locale } from '@/i18n-config';

// Providers
import { getDictionary } from "@/server/get-dictionary";
import { auth } from '@/server/auth';


type MetadataProps = {
    params: { lang: Locale }
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.account.title + " | FixMyTown",
        description: dictionary.pages.auth.account.description,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function AccountPage({
    params: { lang },
}: Props) {
    const session = await auth();
    if (!session) {
        return redirect(`/${lang}/login`);
    }
    const dict = await getDictionary(lang);

    return <AccountClient dictionary={dict} lang={lang} />;
} 