"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { useSession } from "next-auth/react";


export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
};

const useUpdateUserRole = () => {
  const mutation = api.user.updateRole.useMutation();
  const updateUserRole = async (userId: string, role: "admin" | "worker" | "user") => {
    try {
      await mutation.mutateAsync({ userId, role });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  return updateUserRole;
};

export const UserTableColumns = () => {
  const { dictionary } = useDictionary();  // useDictionary inside a functional component

  const columns: ColumnDef<User>[] = [
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
        const updateUserRole = useUpdateUserRole();
        const { toast } = useToast();
        const utils = api.useUtils();

        const handleUpdateUserRole = async (userId: string, role: "admin" | "worker" | "user") => {
          try {
            utils.user.getUsers.setData(undefined, (oldData) =>
              oldData?.map((u) => (u.id === userId ? { ...u, role } : u)) ?? oldData
            );

            await updateUserRole(userId, role);

            toast({
              title: dictionary?.adminPages.userAdministration.toastMessages.successTitle,
              description: dictionary?.adminPages.userAdministration.toastMessages.successMessage,
              variant: "success",
            });

            await utils.user.getUsers.invalidate();
          } catch (error) {
            await utils.user.getUsers.invalidate();
            toast({
              title: dictionary?.adminPages.userAdministration.toastMessages.errorTitle,
              description: dictionary?.adminPages.userAdministration.toastMessages.errorMessage,
              variant: "destructive",
            });
          }
        };

        const { data: session } = useSession(); // Access session data
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
              <DropdownMenuLabel>{dictionary?.adminPages.userAdministration.actions.copyID}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                {dictionary?.adminPages.userAdministration.actions.copyID}
              </DropdownMenuItem>
              {sessionUser?.id !== user.id && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "admin")}>
                    {dictionary?.adminPages.userAdministration.actions.changeRoleToAdmin}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "worker")}>
                    {dictionary?.adminPages.userAdministration.actions.changeRoleToWorker}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "user")}>
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

  return columns;
};
