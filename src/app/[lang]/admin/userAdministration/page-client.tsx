"use client";

// External Libraries
import { Loader2 } from "lucide-react";

// Components
import { DataTable } from "@/components/UserManagementTable/data-table";
import { UserTableColumns } from "@/components/UserManagementTable/columns";

// Types
import type { Dictionary } from "@/dictionaries/dictionary";

// Providers
import { api } from "@/trpc/react";

type Props = {
    dictionary: Dictionary;
};

export default function UserAdministrationClient({ dictionary }: Props) {
    const { data: users, isLoading } = api.users.list.getAll.useQuery();

    const columns = UserTableColumns(dictionary);

    if (isLoading) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    const filteredUsers = users?.filter(user => user.name) ?? [];

    return (
        <div className="container mx-auto py-10">
            <h1>{dictionary?.pages.admin.userAdministration.mainTitle}</h1>
            <DataTable columns={columns} data={filteredUsers} dictionary={dictionary} />
        </div>
    );
}
