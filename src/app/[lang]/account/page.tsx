import { getDictionary } from '@/get-dictionary';
import AccountClient from './account-client';
import { type Locale } from '@/i18n-config';
import { type Metadata } from 'next';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
export async function generateMetadata({
    params: { lang }
}: {
    params: { lang: Locale }
}): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.account.title + " | FixMyTown",
        description: dictionary.pages.auth.account.description,
    };
}

export default async function AccountPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const session = await auth();
    if (!session) {
        return redirect(`/${lang}/login`);
    }
    const dict = await getDictionary(lang);

    return <AccountClient params={{ lang }} dict={dict} />;
} 