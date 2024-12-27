"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { useSession } from "next-auth/react";
import type { User } from "./columns";
import { useToast } from "@/hooks/use-toast";
export function useUserTableColumns() {
    const { dictionary } = useDictionary();
    const utils = api.useUtils();
    const { data: session } = useSession();
    const mutation = api.user.updateRole.useMutation();
    const { toast } = useToast();
    return useMemo<ColumnDef<User>[]>(
        () => {
            const handleUpdateUserRole = async (userId: string, role: "admin" | "worker" | "user") => {
                try {
                    utils.user.getUsers.setData(undefined, (oldData) =>
                        oldData?.map((u) => (u.id === userId ? { ...u, role } : u)) ?? oldData
                    );

                    await mutation.mutateAsync({ userId, role });
                    await utils.user.getUsers.invalidate();
                    toast({
                        title: dictionary?.adminPages.userAdministration.toastMessages.successTitle,
                        description: dictionary?.adminPages.userAdministration.toastMessages.successMessage,
                        variant: "success",
                    });
                } catch {
                    await utils.user.getUsers.invalidate();
                    toast({
                        title: dictionary?.adminPages.userAdministration.toastMessages.errorTitle,
                        description: dictionary?.adminPages.userAdministration.toastMessages.errorMessage,
                        variant: "destructive",
                    });
                }
            };

            return [
                {
                    accessorKey: "id",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.IDColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    accessorKey: "name",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.nameColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    accessorKey: "email",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.emailColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    accessorKey: "emailVerified",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.emailVerifiedColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    accessorKey: "image",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.imageColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    accessorKey: "role",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {dictionary?.adminPages.userAdministration.roleColumnTitle}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    id: "actions",
                    cell: ({ row }) => {
                        const user = row.original;
                        const sessionUser = session?.user;

                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end"> 
                                    <DropdownMenuLabel>{dictionary?.adminPages.userAdministration.actions.actionsTitle}</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                        {dictionary?.adminPages.userAdministration.actions.copyID}
                                    </DropdownMenuItem>
                                    {sessionUser?.id !== user.id && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateUserRole(user.id, "admin")}
                                                disabled={user.role === "admin"}
                                            >
                                                {dictionary?.adminPages.userAdministration.actions.changeRoleToAdmin}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateUserRole(user.id, "worker")}
                                                disabled={user.role === "worker"}
                                            >
                                                {dictionary?.adminPages.userAdministration.actions.changeRoleToWorker}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleUpdateUserRole(user.id, "user")}
                                                disabled={user.role === "user"}
                                            >
                                                {dictionary?.adminPages.userAdministration.actions.changeRoleToUser}
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    },
                },
            ];
        },
        [dictionary, utils, mutation, session]
    );
}