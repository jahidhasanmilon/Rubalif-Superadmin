import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

export async function addTopic(current: string[], topic: string) {
  const name = topic.trim().toLowerCase();
  if (!name || current.includes(name)) return;
  await set(ref(db, "Rubalif/topics"), [...current, name]);
}

export async function removeTopic(current: string[], topic: string) {
  await set(
    ref(db, "Rubalif/topics"),
    current.filter((t) => t !== topic)
  );
}
