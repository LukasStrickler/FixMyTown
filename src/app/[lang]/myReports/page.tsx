import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { getDictionary } from "../../../get-dictionary";
import { type Locale } from "@/i18n-config";
import { ReportsTable } from "@/components/ReportOverview/Table/reports-table";
export default async function MyReports({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const session = await auth();
  const { reports } = await api.report.getUserReports();
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <ReportsTable dictionary={dictionary} reports={reports} worker={false} />
      </main>
    </HydrateClient>
  );
}
