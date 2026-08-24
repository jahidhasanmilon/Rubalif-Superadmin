import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

export type Role = "superadmin" | "editor";

export function encodeEmailKey(email: string): string {
  return email.toLowerCase().replace(/\./g, ",");
}

export async function setUserRole(email: string, role: Role) {
  await set(ref(db, `Rubalif/roles/${encodeEmailKey(email)}`), role);
}

export async function removeUserRole(email: string) {
  await set(ref(db, `Rubalif/roles/${encodeEmailKey(email)}`), null);
}
