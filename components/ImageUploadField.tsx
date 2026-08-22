"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/newsActions";

interface ImageUploadFieldProps {
  label: string;
  placeholderText: string;
  initialUrl?: string;
  onUploaded: (url: string) => void;
}

export default function ImageUploadField({
  label,
  placeholderText,
  initialUrl,
  onUploaded,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string>(initialUrl || "");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview((e.target?.result as string) || "");
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress(0);
    uploadImage(file, setProgress)
      .then((url) => {
        setUploading(false);
        onUploaded(url);
      })
      .catch(() => setUploading(false));
  };

  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
        {label}
      </label>
      <div
        className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50 text-center transition dark:bg-neutral-800/60 ${
          preview
            ? "border-green-500 p-1.5"
            : "border-neutral-200 p-6 hover:border-accent dark:border-neutral-700"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        {!preview && (
          <div>
            <div className="mb-1.5 text-2xl">🖼️</div>
            <div className="mb-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {placeholderText}
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-600">
              JPG, PNG · max 5MB
            </div>
          </div>
        )}
        {preview && (
          <img src={preview} alt="" className="mx-auto max-h-40 rounded-lg object-cover" />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {uploading && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
