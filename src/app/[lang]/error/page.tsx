import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import Link from "next/link";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { type Metadata } from "next";
export const runtime = 'edge'
export const revalidate = 3600

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.error.title + " | FixMyTown",
        description: dictionary.pages.auth.error.description,
    };
}
export default async function ErrorPage({
    params: { lang },
    searchParams,
}: {
    params: { lang: Locale };
    searchParams: Record<string, string | string[] | undefined>;
}) {
    const dictionary = await getDictionary(lang);
    const session = await auth();

    if (session) {
        redirect(`/${lang}/account`);
    }

    const error = searchParams.error as keyof typeof dictionary.pages.auth.error;
    const errorMessage = dictionary.pages.auth.error[error] ?? dictionary.pages.auth.error.Default;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-4 text-center">
                <h1 className="text-4xl font-bold">{dictionary.pages.auth.error.title}</h1>
                <p className="text-muted-foreground">{errorMessage}</p>
                <Button asChild>
                    <Link href={`/${lang}/`}>
                        {dictionary.pages.auth.error.backToHome}
                    </Link>
                </Button>
            </div>
        </div>
    );
}