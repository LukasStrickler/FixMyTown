"use client";

import { useUserTableColumns } from "./useUserTableColumns";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
};

export function UserTableColumns() {
  return useUserTableColumns();
}
