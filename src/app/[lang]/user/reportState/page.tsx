import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { getDictionary } from "../../../../get-dictionary";
import { type Locale } from "@/i18n-config";

export default async function ReportState({
  params: { lang },
}: {
  params: { lang: Locale };
}) {

  const dictionary = await getDictionary(lang);
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div>{JSON.stringify(session)}</div>
        </div>
      </main>
    </HydrateClient>
  );
}
