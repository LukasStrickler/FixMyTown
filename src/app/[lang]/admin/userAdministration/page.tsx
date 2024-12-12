import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { api } from "@/trpc/server"


export default async function UserAdministrationPage() {
  const users = await api.user.getUsers();

  return (
    <div className="container mx-auto py-10">
      <h1>User Administration</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
}