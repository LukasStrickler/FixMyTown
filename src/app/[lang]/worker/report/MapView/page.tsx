// shows map with all reports

// reports are color coded by status
// report icons are assigned by kind 
// size of icon is based on priority

// if clicked on a report, it shows popup with link to details page
// page contains legend with explanation of everything 

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