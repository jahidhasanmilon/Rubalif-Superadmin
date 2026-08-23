"use client";

import { useEffect, useState } from "react";
import type { NewsItem, NewsType } from "@/lib/types";
import { fetchNews, saveEdit } from "@/lib/newsActions";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "./ToastProvider";

interface EditModalProps {
  target: { key: string; type: NewsType } | null;
  onClose: () => void;
  topics: string[];
}

function wordCountInfo(text: string, max: number) {
  const c = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const cls =
    c > max
      ? "text-red-500"
      : c < 50 && c > 0
        ? "text-amber-500"
        : "text-neutral-400 dark:text-neutral-600";
  return { text: `${c}/${max} words`, cls };
}

const inputCls =
  "rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-accent dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100";
const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600";

export default function EditModal({ target, onClose, topics }: EditModalProps) {
  const toast = useToast();
  const [form, setForm] = useState<Partial<NewsItem>>({});
  const [thumbUrl, setThumbUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!target) {
      setLoaded(false);
      return;
    }
    setLoaded(false);
    fetchNews(target.key, target.type).then((n) => {
      setForm({
        headLineEnglish: n.headLineEnglish || n.titleEnglish || n.title || "",
        headLineNepali: n.headLineNepali || n.titleNepali || "",
        descriptionEnglish: n.descriptionEnglish || "",
        descriptionNepali: n.descriptionNepali || "",
        newsSite: n.newsSite || "",
        author: n.author || "",
        url: n.url || "",
        topicA: n.topicA || "",
        topicB: n.topicB || "",
        topicC: n.topicC || "",
      });
      setThumbUrl(n.thumbnail || n.thumb || "");
      setLoaded(true);
    });
  }, [target]);

  if (!target) return null;

  const set =
    (field: keyof NewsItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = async () => {
    const heEn = form.headLineEnglish || "";
    try {
      await saveEdit(target.key, target.type, {
        headLineEnglish: heEn,
        titleEnglish: heEn,
        title: heEn,
        headLineNepali: form.headLineNepali || "",
        titleNepali: form.headLineNepali || "",
        descriptionEnglish: form.descriptionEnglish || "",
        descriptionNepali: form.descriptionNepali || "",
        newsSite: form.newsSite || "",
        author: form.author || "",
        url: form.url || "",
        topicA: form.topicA || "",
        topicB: form.topicB || "",
        topicC: form.topicC || "",
        thumbnail: thumbUrl,
        status: target.type === "published" ? "posted" : "pending",
      });
      onClose();
      toast("✅ Saved!");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const wc1 = wordCountInfo(form.descriptionEnglish || "", 60);
  const wc2 = wordCountInfo(form.descriptionNepali || "", 60);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl shadow-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/50">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">Edit News</div>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500 hover:text-red-500 dark:bg-neutral-800 dark:text-neutral-400"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {!loaded ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-2.5 h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-accent dark:border-neutral-700" />
            Loading...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Headline (English)</label>
                <input
                  type="text"
                  value={form.headLineEnglish || ""}
                  onChange={set("headLineEnglish")}
                  className={`${inputCls} w-full`}
                />
              </div>
              <div>
                <label className={labelCls}>শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={form.headLineNepali || ""}
                  onChange={set("headLineNepali")}
                  className={`${inputCls} w-full font-bangla`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Description English</label>
                <textarea
                  rows={3}
                  value={form.descriptionEnglish || ""}
                  onChange={set("descriptionEnglish")}
                  className={`${inputCls} w-full resize-y`}
                />
                <div className={`mt-1 text-[10px] ${wc1.cls}`}>{wc1.text}</div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={form.descriptionNepali || ""}
                  onChange={set("descriptionNepali")}
                  className={`${inputCls} w-full resize-y font-bangla`}
                />
                <div className={`mt-1 text-[10px] ${wc2.cls}`}>{wc2.text}</div>
              </div>
              <div>
                <label className={labelCls}>News Site</label>
                <input
                  type="text"
                  value={form.newsSite || ""}
                  onChange={set("newsSite")}
                  className={`${inputCls} w-full`}
                />
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input
                  type="text"
                  value={form.author || ""}
                  onChange={set("author")}
                  className={`${inputCls} w-full`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>URL</label>
                <input
                  type="url"
                  value={form.url || ""}
                  onChange={set("url")}
                  className={`${inputCls} w-full`}
                />
              </div>
              <ImageUploadField
                label="Thumbnail"
                placeholderText="Click to change"
                initialUrl={thumbUrl}
                onUploaded={setThumbUrl}
              />
              <div>
                <label className={labelCls}>Topic A</label>
                <select value={form.topicA || ""} onChange={set("topicA")} className={`${inputCls} w-full`}>
                  <option value="">Select</option>
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Topic B</label>
                <select value={form.topicB || ""} onChange={set("topicB")} className={`${inputCls} w-full`}>
                  <option value="">Select</option>
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Topic C</label>
                <select value={form.topicC || ""} onChange={set("topicC")} className={`${inputCls} w-full`}>
                  <option value="">Select</option>
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <button
                className="rounded-lg bg-gradient-to-b from-accent-hover to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110"
                onClick={save}
              >
                💾 Save Changes
              </button>
              <button
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
