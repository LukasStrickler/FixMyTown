// fetches report data from the database based on the reportID slug
// shows ReportDetails component but with all access to the worker


// can edit status and priority
// can set commetns
// can delete report

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export default async function MyReports({
    params: { lang },
}: {
    params: { lang: Locale };
}) {

    const session = await auth();
    await getDictionary(lang);

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <div>{JSON.stringify(session)}</div>


                    {/*                 <
                    ReportDetails
                        dictionary={dictionary}
                        report={data}
                        worker={true}
                    />
                 */}
                </div>
            </main>
        </HydrateClient>
    );
}
