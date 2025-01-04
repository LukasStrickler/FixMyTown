// External Libraries
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Components
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { VerifyTokenInput } from "@/components/auth/verify-token-input";
import { ResendTimer } from "@/components/auth/resend-timer";

// Types
import { type Locale } from "@/i18n-config";
import { type Metadata } from "next";

// Providers
import { getDictionary } from "@/server/get-dictionary";

type MetadataProps = {
    params: { lang: Locale };
};

export async function generateMetadata({
    params: { lang }
}: MetadataProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.pages.auth.verifyRequest.title + " | FixMyTown",
        description: dictionary.pages.auth.verifyRequest.description,
    };
}

type Props = {
    params: { lang: Locale };
};

export default async function VerifyRequestPage({
    params: { lang },
}: Props) {
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
            <Card className="w-full max-w-md shadow-xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-6">
                    <Link
                        href={`/${lang}/`}
                        className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {dictionary.pages.auth.verifyRequest.backToHome}
                    </Link>
                    <h1 className="text-3xl font-bold text-center tracking-tight text-foreground">
                        {dictionary.pages.auth.verifyRequest.title}
                    </h1>
                </CardHeader>
                <CardContent className="px-6">
                    <VerifyTokenInput dictionary={dictionary} />
                    <div className="text-center space-y-2 mt-4">
                        <p className="text-foreground/80">
                            {dictionary.pages.auth.verifyRequest.checkEmail}
                        </p>
                        <ResendTimer dictionary={dictionary} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
