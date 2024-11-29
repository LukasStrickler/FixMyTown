import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
//import { getDictionary } from "../../../../get-dictionary";
import { type Locale } from "@/i18n-config";

export default async function ReportEdit({
  params: { lang },
}: {
  params: { lang: Locale };
}) {

  const session = await auth();
  const user = session?.user; // Get the user object from session

  if (!user || user.role !== "worker") {
    return null;
  }

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
