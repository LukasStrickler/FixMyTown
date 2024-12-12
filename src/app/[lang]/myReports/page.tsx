import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { getDictionary } from "../../../get-dictionary";
import { type Locale } from "@/i18n-config";
import ReportMap from "@/components/ReportOverview/Map/report-map";
import { metadata } from "../layout";
import { reports } from "@/server/db/schema/reports";
export default async function MyReports({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const session = await auth();
  const { reports, metadata } = await api.report.getReports.query({
    userId: session?.user.id,
  });
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <ReportMap dictionary={dictionary} metadata={metadata} reports={reports} />
      </main>
    </HydrateClient>
  );
}
