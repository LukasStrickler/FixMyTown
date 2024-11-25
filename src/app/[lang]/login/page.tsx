'use client';

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            const currentPath = window.location.pathname;
            const lang = currentPath.split('/')[1];
            router.push(`/${lang}/`);
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("resend", {
                email,
                redirect: true,
            });

            if (result?.ok) {
                const currentPath = window.location.pathname;
                const lang = currentPath.split('/')[1];
                //append the email and callbackUrl to the url
                router.push(`/${lang}/verify-request?${new URLSearchParams({ email }).toString()}&callbackUrl=${encodeURIComponent(currentPath)}`);
            }
        } catch (error) {
            console.error("Authentifizierungsfehler:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        Anmelden bei <br /> <i>FixMyTown</i>
                    </h1>
                </CardHeader>
                <CardContent className="px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-medium">
                                E-Mail-Adresse
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="ihre@email.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? "Wird gesendet..." : "Magic Link senden"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}