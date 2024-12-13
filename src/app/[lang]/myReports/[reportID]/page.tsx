// fetches report data from the database based on the reportID slug
// shows ReportDetails component but with restrited access to the user

// only allows own reports to be viewed
//  shows error if not found / not authorized
// only allows some information to be shown
//  no priority information etc
// only allows some actions to be taken
//  delete only when in status 1

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";

export default async function MyReports({
    params: { lang },
}: {
    params: { lang: Locale };
}) {

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
