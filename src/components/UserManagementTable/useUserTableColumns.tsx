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
import { useSession } from "next-auth/react";
import type { User } from "./columns";
import { useToast } from "@/hooks/use-toast";
import type { Dictionary } from "@/dictionaries/dictionary";
export function useUserTableColumns(dictionary: Dictionary) {
    const utils = api.useUtils();
    const { data: session } = useSession();
    const mutation = api.users.management.updateRole.useMutation();
    const { toast } = useToast();
    return useMemo<ColumnDef<User>[]>(
        () => {
            const handleUpdateUserRole = async (userId: string, role: "admin" | "worker" | "user") => {
                try {
                    utils.users.list.getAll.setData(undefined, (oldData) =>
                        oldData?.map((u) => (u.id === userId ? { ...u, role } : u)) ?? oldData
                    );

                    await mutation.mutateAsync({ userId, role });
                    await utils.users.list.getAll.invalidate();
                    toast({
                        title: dictionary?.pages.admin.userAdministration.toastMessages.successTitle,
                        description: dictionary?.pages.admin.userAdministration.toastMessages.successMessage,
                        variant: "success",
                    });
                } catch {
                    await utils.users.list.getAll.invalidate();
                    toast({
                        title: dictionary?.pages.admin.userAdministration.toastMessages.errorTitle,
                        description: dictionary?.pages.admin.userAdministration.toastMessages.errorMessage,
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
                            {dictionary?.pages.admin.userAdministration.IDColumnTitle}
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
                            {dictionary?.pages.admin.userAdministration.nameColumnTitle}
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
                            {dictionary?.pages.admin.userAdministration.emailColumnTitle}
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
                            {dictionary?.pages.admin.userAdministration.emailVerifiedColumnTitle}
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
                            {dictionary?.pages.admin.userAdministration.imageColumnTitle}
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
                            {dictionary?.pages.admin.userAdministration.roleColumnTitle}
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
                                        <span className="sr-only">{dictionary?.pages.admin.userAdministration.actions.actionsTitle}</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{dictionary?.pages.admin.userAdministration.actions.actionsTitle}</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                        {dictionary?.pages.admin.userAdministration.actions.copyID}
                                    </DropdownMenuItem>
                                    {sessionUser?.id !== user.id && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateUserRole(user.id, "admin")}
                                                disabled={user.role === "admin"}
                                            >
                                                {dictionary?.pages.admin.userAdministration.actions.changeRoleToAdmin}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateUserRole(user.id, "worker")}
                                                disabled={user.role === "worker"}
                                            >
                                                {dictionary?.pages.admin.userAdministration.actions.changeRoleToWorker}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateUserRole(user.id, "user")}
                                                disabled={user.role === "user"}
                                            >
                                                {dictionary?.pages.admin.userAdministration.actions.changeRoleToUser}
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dictionary, utils, mutation, session]
    );
}