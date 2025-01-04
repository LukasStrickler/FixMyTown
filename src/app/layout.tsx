// Styles
import "@/styles/globals.css";

// External Libraries
import { GeistSans } from "geist/font/sans";
import { headers } from 'next/headers';

// Types
import type { Locale } from "@/i18n-config";

// Providers
import { DictionaryProvider } from "@/components/provider/dictionaryProvider";

// Config
import { i18n } from "@/i18n-config";


type Props = {
    children: React.ReactNode;
};

export default function RootLayout({
    children,
}: Props) {
    const lang = headers().get('x-pathname')?.split('/')[1] ?? i18n.defaultLocale;
    const validLang = i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale;

    return (
        <html lang={validLang} className={GeistSans.variable} suppressHydrationWarning>
            <body className="min-h-screen">
                <DictionaryProvider>{children}</DictionaryProvider>
            </body>
        </html>

    );
} 