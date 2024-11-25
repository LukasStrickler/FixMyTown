import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { VerifyTokenInput } from "@/components/verify-token-input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type Metadata } from "next";


export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    return {
        title: dictionary.auth.verifyRequest.title + " | FixMyTown",
        description: dictionary.auth.verifyRequest.description,
    };
}


export default async function VerifyRequestPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
            <Card className="w-full max-w-md shadow-xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-6">
                    <Link
                        href={`/${lang}/`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {dictionary.auth.verifyRequest.backToHome}
                    </Link>
                    <h1 className="text-3xl font-bold text-center tracking-tight">
                        {dictionary.auth.verifyRequest.title}
                    </h1>
                </CardHeader>
                <CardContent className="px-6">
                    <VerifyTokenInput dictionary={dictionary} />
                    <p className="text-muted-foreground mt-4 text-center">
                        {dictionary.auth.verifyRequest.checkEmail}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 