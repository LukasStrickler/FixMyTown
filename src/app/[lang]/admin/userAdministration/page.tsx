// External Libraries
import { redirect } from "next/navigation";

// Providers
import { getDictionary } from "@/server/get-dictionary";
import { auth } from "@/server/auth";

// Components
import UserAdministrationClient from "@/app/[lang]/admin/userAdministration/page-client";

// Types
import { type Locale } from "@/i18n-config";

type Props = {
  params: { lang: Locale };
};

export default async function UserAdministrationPage({
  params: { lang },
}: Props) {
  const session = await auth();
  if (!session) {
    return redirect(`/${lang}/login`);
  }
  if (session.user.role !== "admin") {
    return redirect(`/${lang}/`);
  }

  const dictionary = await getDictionary(lang);

  return <UserAdministrationClient dictionary={dictionary} />;
}