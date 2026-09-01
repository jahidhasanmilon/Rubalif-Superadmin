"use client";

import { useRef, useState } from "react";
import { uploadMagazineImage, pushMagazine } from "@/lib/magazineActions";
import { useToast } from "./ToastProvider";

interface AddMagazineTabProps {
  active: boolean;
}

const SLOTS = ["mz_1", "mz_2", "mz_3"];

export default function AddMagazineTab({ active }: AddMagazineTabProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [name, setName] = useState("");
  const [pushing, setPushing] = useState(false);

  if (!active) return null;

  const handleChoose = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
    setUploadedUrls([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadMagazineImage(files[i], (pct) => {
          setProgress(Math.round(((i + pct / 100) / files.length) * 100));
        });
        urls.push(url);
      }
      setUploadedUrls(urls);
      toast(`✅ Uploaded ${urls.length} image(s)`);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setUploading(false);
    }
  };

  const handlePush = async () => {
    if (!name.trim()) {
      toast("Enter a magazine name", "err");
      return;
    }
    if (uploadedUrls.length === 0) {
      toast("Upload images first", "err");
      return;
    }
    setPushing(true);
    try {
      await pushMagazine(slot, name.trim(), uploadedUrls);
      toast(`✅ Pushed to ${slot}!`);
      setFiles([]);
      setPreviews([]);
      setUploadedUrls([]);
      setName("");
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="max-w-xl rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="mb-4 border-b border-neutral-100 pb-3 text-sm font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        📖 Add Magazine
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Image Count: {files.length}</span>
            {uploadedUrls.length > 0 && (
              <span className="font-semibold text-green-600 dark:text-green-400">
                {uploadedUrls.length} uploaded
              </span>
            )}
          </div>

          {previews.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleChoose(e.target.files)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:border-accent dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
            >
              🖼️ Choose
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="flex-1 rounded-lg bg-gradient-to-b from-accent-hover to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? `⏳ ${progress}%` : "⬆ Upload"}
            </button>
          </div>
          {uploading && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
            Magazine Slot
          </label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100"
          >
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
            Magazine Name
          </label>
          <input
            type="text"
            placeholder="Enter Magazine Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100"
          />
        </div>

        <button
          onClick={handlePush}
          disabled={pushing}
          className="rounded-lg bg-gradient-to-b from-accent-hover to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pushing ? "⏳ Pushing..." : "📤 Push"}
        </button>
      </div>
    </div>
  );
}
