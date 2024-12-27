import UserAdministrationClient from "./client";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { type Locale } from "@/i18n-config";

export default async function UserAdministrationPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const session = await auth();
  if (!session) {
    return redirect(`/${lang}/login`);
  }
  if (session.user.role !== "admin") {
    return redirect(`/${lang}/`);
  }

  return <UserAdministrationClient />;
}