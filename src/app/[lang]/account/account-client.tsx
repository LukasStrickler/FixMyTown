'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dictionary } from "@/dictionaries/dictionary";
import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";
import { api } from "@/trpc/react";
import { EditNameDialog } from "@/components/account/edit-name-dialog";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccountPageProps {
    params: {
        lang: string;
    };
    dict: Dictionary;
}



export default function AccountPage({ params: { lang }, dict }: AccountPageProps) {
    const router = useRouter();
    const { data: session, status, update: updateSession } = useSession();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditNameDialog, setShowEditNameDialog] = useState(false);
    const { toast } = useToast();

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
            toast({
                variant: "destructive",
                title: dict.pages.auth.error.title,
                description: dict.pages.auth.error.LogoutError,
            });
        }
    };

    const deleteUserMutation = api.user.deleteCallingUser.useMutation();

    const handleDeleteAccount = async () => {
        try {
            await deleteUserMutation.mutateAsync();
            await signOut({ redirect: false });
            router.push(`/${lang}`);
        } catch (error) {
            console.error(dict.pages.auth.error.DeleteAccountError, error);
            toast({
                variant: "destructive",
                title: dict.pages.auth.error.title,
                description: dict.pages.auth.error.DeleteAccountError,
            });
        }
    };

    const updateNameMutation = api.user.updateCallingUserName.useMutation();

    const handleUpdateName = async (newName: string) => {
        try {
            if (!session) return;
            await updateNameMutation.mutateAsync({ name: newName });
            setShowEditNameDialog(false);
            await updateSession();
            toast({
                title: dict.pages.auth.account.editNameDialog.title,
                description: dict.pages.auth.account.editNameDialog.success,
            });
        } catch (error) {
            console.error(dict.pages.auth.error.Default, error);
            toast({
                variant: "destructive",
                title: dict.pages.auth.error.title,
                description: dict.pages.auth.error.Default,
            });
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

                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-muted-foreground">Name</h2>
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </CardContent>
                    <Separator className="mb-6" />
                    <CardFooter className="flex flex-col gap-2.5 pt-0">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push(`/${lang}`)}
                        >
                            {dict.common.backToLanding}
                        </Button>
                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled
                        >
                            {dict.pages.auth.account.profile.signOut}
                        </Button>
                        <Separator className="my-4" />

                        <Button
                            className="w-full bg-red-500 hover:bg-red-600 opacity-50 cursor-not-allowed"
                            variant="destructive"
                        >
                            {dict.pages.auth.account.profile.deleteAccount}
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

                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            {dict.pages.auth.account.profile.name}
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="text-base">{session.user.name}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowEditNameDialog(true)}
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">{dict.pages.auth.account.profile.editName}</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <Separator className="mb-6" />
                <CardFooter className="flex flex-col gap-2.5 pt-0">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push(`/${lang}`)}
                    >
                        {dict.common.backToLanding}
                    </Button>
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleLogout}
                    >
                        {dict.pages.auth.account.profile.signOut}
                    </Button>
                    <Separator className="my-4" />
                    <DeleteAccountDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        onConfirm={handleDeleteAccount}
                        dictionary={dict}
                    />
                    <Button
                        className="w-full bg-red-500 hover:bg-red-600"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        {dict.pages.auth.account.profile.deleteAccount}
                    </Button>
                </CardFooter>
            </Card>
            <EditNameDialog
                open={showEditNameDialog}
                onOpenChange={setShowEditNameDialog}
                onConfirm={handleUpdateName}
                dictionary={dict}
                currentName={session.user.name ?? ""}
            />
        </div>
    );
} 