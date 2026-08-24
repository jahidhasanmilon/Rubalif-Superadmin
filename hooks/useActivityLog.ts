"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";

export interface ActivityEntry {
  key: string;
  action: string;
  by: string;
  at: number;
  title: string;
}

export function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "Rubalif/activityLog"), (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val as Record<string, Omit<ActivityEntry, "key">>)
        .map(([key, entry]) => ({ key, ...entry }))
        .sort((a, b) => (a.key < b.key ? 1 : -1));
      setEntries(list);
    });
    return () => unsub();
  }, []);

  return entries;
}
