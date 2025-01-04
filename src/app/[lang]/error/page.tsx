// External Libraries
import Link from "next/link";
import { redirect } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";

// Types
import { type Locale } from "@/i18n-config";
import { type Metadata } from "next";

// Providers
import { getDictionary } from "@/server/get-dictionary";
import { auth } from "@/server/auth";

// Page Configuration
export const runtime = 'edge';
export const revalidate = 3600;

type MetadataProps = {
    params: { lang: Locale };
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.error.title + " | FixMyTown",
        description: dictionary.pages.auth.error.description,
    };
}

type Props = {
    params: { lang: Locale };
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function ErrorPage({
    params: { lang },
    searchParams,
}: Props) {
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