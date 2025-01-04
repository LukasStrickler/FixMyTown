// External Libraries
import { type Metadata } from 'next';

// Components
import UserAdministrationClient from "@/app/[lang]/admin/userAdministration/page-client";
import { RoleGuard } from '@/components/provider/RoleGuard';

// Types
import { type Locale } from "@/i18n-config";
import { adminLevel } from '@/server/auth/roles';

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
    title: dictionary.pages.admin.userAdministration.mainTitle + " | FixMyTown",
    description: dictionary.pages.admin.userAdministration.mainTitle,
  };
}

type Props = {
  params: { lang: Locale };
};

export default async function UserAdministrationPage({
  params: { lang },
}: Props) {
  const dictionary = await getDictionary(lang);

  return (
    <RoleGuard
      allowedRoles={adminLevel}
      lang={lang}
      redirectTo=""
    >
      <UserAdministrationClient dictionary={dictionary} />
    </RoleGuard>
  );
}