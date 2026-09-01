import { get, ref, remove } from "firebase/database";
import { db } from "@/lib/firebase";

export async function removeAutomationRun(key: string) {
  await remove(ref(db, `Rubalif/automationRuns/${key}`));
}

export async function clearAutomationLog() {
  const snap = await get(ref(db, "Rubalif/automationRuns"));
  const keys = Object.keys(snap.val() || {});
  await Promise.all(keys.map((k) => remove(ref(db, `Rubalif/automationRuns/${k}`))));
}
