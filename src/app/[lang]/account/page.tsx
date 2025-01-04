// External Libraries
import { type Metadata } from 'next';

// Components
import AccountClient from '@/app/[lang]/account/page-client';
import { RoleGuard } from '@/components/provider/RoleGuard';

// Types
import { type Locale } from '@/i18n-config';
import { userLevel } from '@/server/auth/roles';
// Providers
import { getDictionary } from "@/server/get-dictionary";

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
    const dict = await getDictionary(lang);

    return (
        <RoleGuard
            allowedRoles={userLevel}
            lang={lang}
            redirectTo="/login"
        >
            <AccountClient dictionary={dict} lang={lang} />
        </RoleGuard>
    );
} 