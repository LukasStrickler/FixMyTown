import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/server/auth";
import { Button } from "@/components/ui/button";

// export const metadata: Metadata = {
//     title: "Fehler | FixMyTown",
//     description: "Ein Fehler ist aufgetreten",
// };

export const runtime = 'edge'
export const revalidate = 3600

export default async function ErrorPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const [resolvedSearchParams, session] = await Promise.all([
        searchParams,
        auth(),
    ]);
    const error = resolvedSearchParams.error;

    // if (!error) {
    //     redirect("/");
    // }

    const errorMessages: Record<string, string> = {
        Configuration: "Es gibt ein Problem mit der Serverkonfiguration.",
        Verification: "Der Anmeldelink ist nicht mehr gültig.",
        LogoutError: "Beim Abmelden ist ein Fehler aufgetreten.",
        Default: "Ein unerwarteter Fehler ist aufgetreten.",
    };

    const errorMessage = errorMessages[error as string] ?? errorMessages.Default;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-card-foreground mb-4">
                    Ups! Etwas ist schiefgelaufen
                </h1>
                <p className="text-muted-foreground mb-8 leading-relaxed whitespace-pre-line">
                    {errorMessage}
                </p>
                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        Erneut Email Senden
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-card-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        Zurück zur Startseite
                    </Link>
                    {session && (
                        //trigger logout once clicked the button
                        <Button
                            onClick={() => signOut()}
                        >
                            Abmelden
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}