import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/provider/themeProvider";
import { DictionaryProvider } from "@/components/provider/dictionaryProvider";

export default function NotFoundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html className={GeistSans.variable}>
            <body className="min-h-screen">
                <DictionaryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </DictionaryProvider>
            </body>
        </html>
    );
} 