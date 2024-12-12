"use client";

import { UserTableColumns } from "./columns";  // Use the function to get columns
import { DataTable } from "./data-table";
import { api } from "@/trpc/react";
import { useDictionary } from "@/components/provider/dictionaryProvider";

export default function UserAdministrationPage() {
  const { dictionary } = useDictionary();

  const { data: users, isLoading } = api.user.getUsers.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Get columns by calling the UserTableColumns function
  const columns = UserTableColumns();

  return (
    <div className="container mx-auto py-10">
      <h1>{dictionary?.adminPages.userAdministration.mainTitle}</h1>
      <DataTable columns={columns} data={users ?? []} />
    </div>
  );
}
