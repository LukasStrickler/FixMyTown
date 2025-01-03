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
import type { Dictionary } from "@/dictionaries/dictionary";

interface LoginClientProps {
    dictionary: Dictionary;
}

export function LoginClient({ dictionary }: LoginClientProps) {
    const router = useRouter();
    const { status } = useSession();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && status === "authenticated") {
            const currentPath = window.location.pathname;
            const lang = currentPath.split('/')[1];
            router.replace(`/${lang}/`);
        }
    }, [status, router, mounted]);

    if (!mounted) {
        return null;
    }

    if (status === "authenticated") {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("resend", {
                email,
                redirect: false,
                callbackUrl: window.location.pathname
            });

            if (result?.ok) {
                const currentPath = window.location.pathname;
                const lang = currentPath.split('/')[1];
                router.push(`/${lang}/verify-request?${new URLSearchParams({
                    email,
                    callbackUrl: "/"
                }).toString()}`);
            } else {
                console.error("Sign in failed:", result?.error);
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
                        {dictionary.pages.auth.login.backToHome}
                    </Link>
                    <h1 className="text-3xl font-bold text-center tracking-tight">
                        {dictionary.pages.auth.login.title}
                        <br />
                        {/* eslint-disable i18next/no-literal-string */}
                        <i>FixMyTown</i>
                        {/* eslint-enable i18next/no-literal-string */}
                    </h1>
                </CardHeader>
                <CardContent className="px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-medium">
                                {dictionary.pages.auth.login.emailLabel}
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder={dictionary.pages.auth.login.emailPlaceholder}
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
                            {isLoading ? dictionary.pages.auth.login.submitLoading : dictionary.pages.auth.login.submit}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 