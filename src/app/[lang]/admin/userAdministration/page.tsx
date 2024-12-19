"use client";

import { UserTableColumns } from "./columns";
import { DataTable } from "./data-table";
import { api } from "@/trpc/react";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { Loader2 } from "lucide-react";


export default function UserAdministrationPage() {
  const { dictionary } = useDictionary();
  const { data: users, isLoading } = api.user.getUsers.useQuery();
  
  const columns = UserTableColumns();

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  const filteredUsers = users?.filter(user => user.name) ?? [];

  return (
    <div className="container mx-auto py-10">
      <h1>{dictionary?.adminPages.userAdministration.mainTitle}</h1>
      <DataTable columns={columns} data={filteredUsers} />
    </div>
  );
}
