"use client"

import { ColumnDef } from "@tanstack/react-table"

// Define the shape of the user data
export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
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
