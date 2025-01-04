// External Libraries
import { type Metadata } from 'next';

// Components
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { HydrateClient } from "@/trpc/server";
import { RoleGuard } from '@/components/provider/RoleGuard';

// Types
import { type Locale } from "@/i18n-config";
import { userLevel } from '@/server/auth/roles';

// Providers
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type MetadataProps = {
  params: { lang: Locale }
};

export async function generateMetadata({
  params: { lang }
}: MetadataProps): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.myReports.myReports + " | FixMyTown",
    description: dictionary.layout.navigation.workspaces.userWorkspace.navItems.myReports.folderTitle,
  };
}

type Props = {
  params: { lang: Locale };
};

export default async function MyReports({
  params: { lang },
}: Props) {
  const dictionary = await getDictionary(lang);
  const result = await api.reports.list.AllReportsOfCalling();

  const typedReports = result?.reports ?? [];

  return (
    <RoleGuard
      allowedRoles={userLevel}
      lang={lang}
      redirectTo="/login"
    >
      <HydrateClient>
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <ReportsTable
            dictionary={dictionary}
            reports={typedReports}
            worker={false}
          />
        </main>
      </HydrateClient>
    </RoleGuard>
  );
}
