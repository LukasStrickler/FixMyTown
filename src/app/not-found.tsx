'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { i18n } from "@/i18n-config";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { ThemeProvider } from "@/components/provider/themeProvider";

export default function NotFound() {
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
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex items-center justify-center bg-background">
                    <div className="container px-4 py-16 text-center">
                        <h1 className="text-4xl font-bold mb-4 pt-32">
                            {dictionary.pages.error.notFound.title}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {dictionary.pages.error.notFound.description}
                        </p>
                        <Button asChild>
                            <Link href={`/${lang}`}>
                                {dictionary.pages.error.notFound.backToHome}
                            </Link>
                        </Button>
                    </div>
                </div>
                <Footer dictionary={dictionary} />
            </div>
        </ThemeProvider>
    );
} 