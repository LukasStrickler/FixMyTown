import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
// import { getDictionary } from "../../../../get-dictionary";
import { type Locale } from "@/i18n-config";

export default async function UserAdministration({
  params: { lang },
}: {
  params: { lang: Locale };
}) {

  const session = await auth();
  const user = session?.user; // Get the user object from session

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <HydrateClient>
      <div>
        <h1>User Administration</h1>
        <p>Users will be displayed here</p>
      </div>
    </HydrateClient>
  );
}
