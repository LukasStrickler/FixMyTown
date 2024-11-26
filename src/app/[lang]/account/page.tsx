import { getDictionary } from '@/get-dictionary';
import AccountClient from './account-client';
import { type Locale } from '@/i18n-config';
import { type Metadata } from 'next';

export async function generateMetadata({
    params: { lang }
}: {
    params: { lang: Locale }
}): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.auth.account.title + " | FixMyTown",
        description: dictionary.auth.account.description,
    };
}

export default async function AccountPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const dict = await getDictionary(lang);

    return <AccountClient params={{ lang }} dict={dict} />;
} 