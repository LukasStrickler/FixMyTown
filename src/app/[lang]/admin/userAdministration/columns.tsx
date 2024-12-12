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
} from "@/components/ui/dropdown-menu"; // Adjust import path based on your project structure
import { api } from "@/trpc/react";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the shape of the user data
export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
};

// Add the refresh action listener
const UserAdministration = () => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      // Perform the refresh action here
      console.log("Refreshing data...");
      // Reset the refresh state
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div>
      <Button onClick={() => setRefresh(true)}>Refresh</Button>
      {/* Other components and logic */}
    </div>
  );
};

export default UserAdministration;

const useUpdateUserRole = () => {
  const mutation = api.user.updateRole.useMutation();
  const updateUserRole = async (userId: string, role: 'admin' | 'worker' | 'user') => {
    try {
      await mutation.mutateAsync({ userId, role });

    } catch (error) {
      console.error('Error updating role:', error);
    }
  };
  return updateUserRole;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
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
        Name
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
        Email
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
        Email Verified
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
        Image
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
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const updateUserRole = useUpdateUserRole();
      const [successMessage, setSuccessMessage] = useState<string | null>(null);
      const { toast } = useToast();
      const utils = api.useUtils();

      const handleUpdateUserRole = async (userId: string, role: 'admin' | 'worker' | 'user') => {
        try {
          console.log(`Updating user role for userId: ${userId} to role: ${role}`);
          const response = await updateUserRole(userId, role);
          console.log('Update response:', response);

          const message = `User role updated to ${role} successfully.`;
          toast({
            title: "Success",
            description: message,
            variant: "success",
          });

          console.log('Invalidating user cache');
          void utils.user.getUsers.invalidate();

          // Explicitly re-fetch user data
          await utils.user.getUsers.fetch();

          setSuccessMessage(message);
        } catch (error) {
          console.error('Failed to update user role:', error);
          toast({
            title: "Error",
            description: "Failed to update user role.",
            variant: "destructive",
          });
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'admin')}>
                Promote to admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'worker')}>
                Promote to worker
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'user')}>
                Promote to user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
