"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";

export interface AutomationRun {
  key: string;
  added: number;
  alreadyExists: number;
  errors: number;
  log: string[];
  finishedAt: string;
  trigger: "cron" | "manual";
  triggeredBy: string | null;
}

export function useAutomationLog() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "Rubalif/automationRuns"), (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val as Record<string, Omit<AutomationRun, "key">>)
        .map(([key, run]) => ({ key, ...run }))
        .sort((a, b) => (a.key < b.key ? 1 : -1));
      setRuns(list);
    });
    return () => unsub();
  }, []);

  return runs;
}
