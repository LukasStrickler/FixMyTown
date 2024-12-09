"use client"

import { ColumnDef } from "@tanstack/react-table"

// Define the shape of the user data
export type User = {
  id: string;
  name?: string;
  email: string;
  emailVerified?: number;
  image?: string;
  role?: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]
