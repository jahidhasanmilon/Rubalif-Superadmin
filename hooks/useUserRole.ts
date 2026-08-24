"use client";

import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { encodeEmailKey, type Role } from "@/lib/roles";

export interface RoleEntry {
  email: string;
  role: Role;
}

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<Role | null>(null);
  const [allRoles, setAllRoles] = useState<RoleEntry[]>([]);

  useEffect(() => {
    const rolesRef = ref(db, "Rubalif/roles");
    const unsub = onValue(rolesRef, (snap) => {
      const all = (snap.val() || {}) as Record<string, Role>;
      const entries = Object.entries(all).map(([key, r]) => ({
        email: key.replace(/,/g, "."),
        role: r,
      }));
      setAllRoles(entries);

      if (!user?.email) {
        setRole(null);
        return;
      }
      const key = encodeEmailKey(user.email);
      if (Object.keys(all).length === 0) {
        // Bootstrap: first person to load this app becomes superadmin.
        set(ref(db, `Rubalif/roles/${key}`), "superadmin");
        setRole("superadmin");
        return;
      }
      setRole(all[key] || "editor");
    });
    return () => unsub();
  }, [user?.email]);

  return { role, allRoles };
}
