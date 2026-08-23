"use client";

import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { TOPICS as DEFAULT_TOPICS } from "@/lib/constants";

export function useTopics() {
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);

  useEffect(() => {
    const topicsRef = ref(db, "Rubalif/topics");
    const unsub = onValue(topicsRef, (snap) => {
      const val = snap.val();
      if (Array.isArray(val) && val.length > 0) {
        setTopics(val);
      } else {
        setTopics(DEFAULT_TOPICS);
        set(topicsRef, DEFAULT_TOPICS);
      }
    });
    return () => unsub();
  }, []);

  return topics;
}
