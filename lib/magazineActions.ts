import { ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref, set } from "firebase/database";
import { storage, db } from "@/lib/firebase";

export function uploadMagazineImage(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = sRef(storage, `magazines/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(r, file);
    task.on(
      "state_changed",
      (s) => onProgress((s.bytesTransferred / s.totalBytes) * 100),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function pushMagazine(slot: string, name: string, imageUrls: string[]) {
  await set(ref(db, `Rubalif/magazines/${slot}`), {
    name,
    imageUrls,
    imageCount: imageUrls.length,
    updatedAt: Date.now(),
  });
}
