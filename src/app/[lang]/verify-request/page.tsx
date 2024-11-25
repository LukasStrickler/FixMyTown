import { VerifyTokenInput } from "@/components/verify-token-input";
import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "E-Mail prüfen | Der Eilbote",
    description: "Bitte prüfen Sie Ihre E-Mails für den Anmeldelink",
};

export default function VerifyRequestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
            <Card className="w-full max-w-md shadow-xl backdrop-blur-sm bg-card/95">
                <CardHeader className="space-y-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zur Startseite
                    </Link>
                    <h1 className="text-3xl font-bold text-center tracking-tight">
                        Prüfen Sie Ihre E-Mails
                    </h1>
                </CardHeader>
                <CardContent className="px-6">
                    <VerifyTokenInput />
                    <p className="text-muted-foreground mt-4 text-center">
                        Ein Anmeldelink wurde an Ihre E-Mail-Adresse gesendet. Bitte prüfen Sie Ihren Posteingang und klicken Sie auf den Link, um fortzufahren.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 