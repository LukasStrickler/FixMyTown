import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { type Locale } from "@/i18n-config";
import { User, columns } from "./columns"
import { DataTable } from "./data-table"
//import { fetchUsers } from "@/server/db/fetchUsers" // Adjust the import path as needed

async function getData(): Promise<User[]> {
  // Fetch data from your database here.
  //return await fetchUsers()
return [
{
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  emailVerified: 1,
  image: "https://example.com/image1.jpg",
  role: "admin",
},
{
  id: "2",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  emailVerified: 0,
  image: "https://example.com/image2.jpg",
  role: "user",
},
{
  id: "3",
  name: "Alice Johnson",
  email: "alice.johnson@example.com",
  emailVerified: 1,
  image:"test",
  role: "user",
}
];
}

export default async function UserAdministrationPage() {
  const session = await auth();
  const user = session?.user; // Get the user object from session

  if (!user || user.role !== "admin") {
    return null;
  }

  const data = await getData()

  return (
    <HydrateClient>
      <div className="container mx-auto py-10">
        <h1>User Administration</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </HydrateClient>
  )
}
