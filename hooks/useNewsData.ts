"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import type { NewsRecord } from "@/lib/types";

export function useNewsData() {
  const [pending, setPending] = useState<NewsRecord>({});
  const [published, setPublished] = useState<NewsRecord>({});

  useEffect(() => {
    const unsubPending = onValue(ref(db, "Rubalif/toApprove"), (snap) => {
      setPending(snap.val() || {});
    });
    const unsubPublished = onValue(ref(db, "Rubalif/summariser"), (snap) => {
      setPublished(snap.val() || {});
    });
    return () => {
      unsubPending();
      unsubPublished();
    };
  }, []);

  return { pending, published };
}
