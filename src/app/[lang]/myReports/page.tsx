import { api, HydrateClient } from "@/trpc/server";
import { getDictionary } from "../../../get-dictionary";
import type { Locale } from "@/i18n-config";
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
import type { ReportData } from "@/components/reporting/report";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
export default async function MyReports({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
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
