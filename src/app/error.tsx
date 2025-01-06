'use client';

// External Libraries
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

// Hooks
import { useDictionary } from "@/hooks/use-dictionary";
import { usePathname } from "next/navigation";

// Config
import { i18n } from "@/i18n-config";
import { ThemeProvider } from "@/components/provider/themeProvider";
import { Footer } from "@/components/footer";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const pathname = usePathname();
    const urlLang = pathname.split('/')[1];
    const lang = i18n.locales.includes(urlLang as 'en' | 'de')
        ? urlLang
        : i18n.defaultLocale;

    const { dictionary } = useDictionary();

    if (!dictionary) {
        return null;
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex min-h-screen flex-col">
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full space-y-4 text-center">
                        <h1 className="text-4xl font-bold">500</h1>
                        <h2 className="text-xl font-semibold">{dictionary.pages.error.serverError.title}</h2>
                        <p className="text-muted-foreground">
                            {dictionary.pages.error.serverError.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={reset} variant="default">
                                {dictionary.pages.error.serverError.tryAgain}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/${lang}`}>
                                    {dictionary.pages.error.serverError.backToHome}
                                </Link>
                            </Button>
                        </div>
                        {error.digest && (
                            <p className="text-sm text-muted-foreground">
                                {dictionary.pages.error.serverError.errorCode}: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
                <Footer dictionary={dictionary} />
            </div>
        </ThemeProvider>
    );
}