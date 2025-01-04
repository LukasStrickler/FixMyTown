// External Libraries
import { redirect } from "next/navigation";

// Components
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import { HydrateClient } from "@/trpc/server";

// Types
import type { Locale } from "@/i18n-config";
import type { ReportData } from "@/components/reporting/report";

// Providers
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { getDictionary } from "@/server/get-dictionary";

type Props = {
  params: { lang: Locale };
};

export default async function MyReports({
  params: { lang },
}: Props) {
  const session = await auth();
  if (!session) {
    return redirect(`/${lang}/login`);
  }

  const dictionary = await getDictionary(lang);
  const result = await api.report.getUserReports();

  // Type assertion with proper type checking
  const typedReports = (result?.reports ?? []) as ReportData[];

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <ReportsTable
          dictionary={dictionary}
          reports={typedReports}
          worker={false}
        />
      </main>
    </HydrateClient>
  );
}
