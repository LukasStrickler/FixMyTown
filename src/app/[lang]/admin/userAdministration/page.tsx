"use client";

import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { api } from "@/trpc/react"

export default function UserAdministrationPage() {
  const { data: users, isLoading } = api.user.getUsers.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1>User Administration</h1>
      <DataTable columns={columns} data={users ?? []} />
    </div>
  )
}