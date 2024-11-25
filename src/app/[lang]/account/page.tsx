'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
export default function AccountPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.replace('/login');
        }
    }, [session, status, router]);

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/');
        } catch (error) {
            console.error("Fehler beim Abmelden:", error);
            router.push('/?error=LogoutError');
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl">Konto Details</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-muted-foreground">E-Mail</h2>
                            <Skeleton className="h-6 w-48" />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-muted-foreground">Rolle</h2>
                            <Skeleton className="h-6 w-24" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-sm font-medium text-muted-foreground">Funktionen</h2>
                            <div className="flex flex-wrap gap-1.5">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-14" />
                            </div>
                        </div>
                    </CardContent>
                    <Separator className="mb-6" />
                    <CardFooter className="flex flex-col gap-2.5 pt-0">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push('/workspace')}
                        >
                            Zurück zum Workspace
                        </Button>
                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled
                        >
                            Abmelden
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
                    <CardTitle className="text-2xl">Konto Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-muted-foreground">E-Mail</h2>
                        <p className="text-base">{session.user.email}</p>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-muted-foreground">Rolle</h2>
                        <p className="text-base capitalize">{session.user.role}</p>
                    </div>


                </CardContent>
                <Separator className="mb-6" />
                <CardFooter className="flex flex-col gap-2.5 pt-0">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push('/')}
                    >
                        Zurück zur Startseite
                    </Button>
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleLogout}
                    >
                        Abmelden
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 