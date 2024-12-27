'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dictionary } from "@/dictionaries/dictionary";

interface AccountPageProps {
    params: {
        lang: string;
    };
    dict: Dictionary;
}

export default function AccountPage({ params: { lang }, dict }: AccountPageProps) {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.replace(`/${lang}/login`);
        }
    }, [session, status, router, lang]);

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.push(`/${lang}`);
        } catch (error) {
            console.error(dict.pages.auth.error.LogoutError, error);
            router.push(`/${lang}?error=LogoutError`);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl">{dict.pages.auth.account.title}</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-muted-foreground">{dict.pages.auth.account.profile.email}</h2>
                            <Skeleton className="h-6 w-48" />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-muted-foreground">Role</h2>
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </CardContent>
                    <Separator className="mb-6" />
                    <CardFooter className="flex flex-col gap-2.5 pt-0">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push(`/${lang}/workspace`)}
                        >
                            Back to Workspace
                        </Button>
                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled
                        >
                            {dict.pages.auth.account.profile.signOut}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">{dict.pages.auth.account.title}</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-muted-foreground">{dict.pages.auth.account.profile.email}</h2>
                        <p className="text-base">{session.user.email}</p>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-muted-foreground">Role</h2>
                        <p className="text-base capitalize">{session.user.role}</p>
                    </div>
                </CardContent>
                <Separator className="mb-6" />
                <CardFooter className="flex flex-col gap-2.5 pt-0">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push(`/${lang}`)}
                    >
                        {dict.pages.auth.login.backToHome}
                    </Button>
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleLogout}
                    >
                        {dict.pages.auth.account.profile.signOut}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 