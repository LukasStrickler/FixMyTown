import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
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
                    {children}
                </DictionaryProvider>
            </body>
        </html>
    );
} 