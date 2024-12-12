import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { ButtonUpload } from "../../components/uploadbutton";
import { getDictionary } from "../../get-dictionary";
import { type Locale } from "@/i18n-config";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {

  const dictionary = await getDictionary(lang);
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();


  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div>{JSON.stringify(session)}</div>
          <div>{dictionary.index.helloWorld}</div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl ">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Button asChild={true} className="rounded-full bg-primary px-10 py-3 font-semibold no-underline transition hover:bg-primary/50">
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  {session ? "Sign out" : "Sign in"}
                </Link>
              </Button>
            </div>
          </div>
          <ModeToggle></ModeToggle>

        </div>
      </main>
    </HydrateClient>
  );
}
