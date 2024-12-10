import { db } from "@/server/db"; // Passen Sie den Importpfad an
import { users } from "@/server/db/schema/users"; // Passen Sie den Importpfad an

export async function fetchUsers() {
  const userData = await db.select().from(users).all();

  return userData.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
  }));
}