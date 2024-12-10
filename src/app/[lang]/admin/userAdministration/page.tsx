import { User, columns } from "./columns"
import { DataTable } from "./data-table"
import { fetchUsers } from "@/server/db/fetchUsers" // Passen Sie den Importpfad an

async function getData(): Promise<User[]> {
  // Benutzerdaten aus der Datenbank abrufen
  return await fetchUsers()
}

export default async function UserAdministrationPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1>User Administration</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}