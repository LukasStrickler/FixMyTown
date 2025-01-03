import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { DictionaryProvider } from "@/components/provider/dictionaryProvider";
import { headers } from 'next/headers';
import { i18n, type Locale } from "@/i18n-config";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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