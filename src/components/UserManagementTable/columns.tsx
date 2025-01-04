"use client";

import type { Dictionary } from "@/dictionaries/dictionary";
import { useUserTableColumns } from "./useUserTableColumns";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
};

export function UserTableColumns(dictionary: Dictionary) {
  return useUserTableColumns(dictionary);
}
