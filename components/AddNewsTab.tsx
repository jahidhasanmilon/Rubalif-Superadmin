"use client";

import { useState } from "react";
import { TOPICS } from "@/lib/constants";
import { submitNews } from "@/lib/newsActions";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "./ToastProvider";

interface AddNewsTabProps {
  active: boolean;
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

const emptyForm = {
  heEn: "",
  heBn: "",
  deEn: "",
  deBn: "",
  site: "",
  author: "",
  url: "",
  tA: "",
  tB: "",
  tC: "",
};

const inputCls =
  "rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-accent dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100";
const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600";

export default function AddNewsTab({ active }: AddNewsTabProps) {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [thumbUrl, setThumbUrl] = useState("");
  const [imgKey, setImgKey] = useState(0);

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const clearForm = () => {
    setForm(emptyForm);
    setThumbUrl("");
    setImgKey((k) => k + 1);
  };

  if (!active) return null;

  const submit = async () => {
    if (!form.heEn || !form.url) {
      toast("Headline and URL required!", "err");
      return;
    }
    try {
      await submitNews({
        headLineEnglish: form.heEn,
        titleEnglish: form.heEn,
        headLineNepali: form.heBn,
        titleNepali: form.heBn,
        descriptionEnglish: form.deEn,
        descriptionNepali: form.deBn,
        newsSite: form.site,
        author: form.author,
        url: form.url,
        thumbnail: thumbUrl,
        topicA: form.tA,
        topicB: form.tB,
        topicC: form.tC,
        status: "pending",
      });
      toast("✅ Submitted!");
      clearForm();
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const wc1 = wordCountInfo(form.deEn, 60);
  const wc2 = wordCountInfo(form.deBn, 60);

  return (
    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="mb-4 border-b border-neutral-100 pb-3 text-sm font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        Add New News
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Headline (English)</label>
          <input
            type="text"
            placeholder="English headline"
            value={form.heEn}
            onChange={set("heEn")}
            className={`${inputCls} w-full`}
          />
        </div>
        <div>
          <label className={labelCls}>শিরোনাম (বাংলা)</label>
          <input
            type="text"
            placeholder="বাংলায় শিরোনাম"
            value={form.heBn}
            onChange={set("heBn")}
            className={`${inputCls} w-full font-bangla`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description English (50-60 words)</label>
          <textarea
            rows={3}
            placeholder="Min 50, max 60 words..."
            value={form.deEn}
            onChange={set("deEn")}
            className={`${inputCls} w-full resize-y`}
          />
          <div className={`mt-1 text-[10px] ${wc1.cls}`}>{wc1.text}</div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>বিবরণ (বাংলা) — ৫০-৬০ শব্দ</label>
          <textarea
            rows={3}
            placeholder="ন্যূনতম ৫০, সর্বোচ্চ ৬০ শব্দ..."
            value={form.deBn}
            onChange={set("deBn")}
            className={`${inputCls} w-full resize-y font-bangla`}
          />
          <div className={`mt-1 text-[10px] ${wc2.cls}`}>{wc2.text}</div>
        </div>
        <div>
          <label className={labelCls}>News Site</label>
          <input
            type="text"
            placeholder="e.g. Prothom Alo"
            value={form.site}
            onChange={set("site")}
            className={`${inputCls} w-full`}
          />
        </div>
        <div>
          <label className={labelCls}>Author</label>
          <input
            type="text"
            placeholder="Author name"
            value={form.author}
            onChange={set("author")}
            className={`${inputCls} w-full`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Article URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={set("url")}
            className={`${inputCls} w-full`}
          />
        </div>
        <ImageUploadField
          key={imgKey}
          label="Thumbnail"
          placeholderText="Click to upload thumbnail"
          onUploaded={setThumbUrl}
        />
        <div>
          <label className={labelCls}>Topic A</label>
          <select value={form.tA} onChange={set("tA")} className={`${inputCls} w-full`}>
            <option value="">Select</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Topic B</label>
          <select value={form.tB} onChange={set("tB")} className={`${inputCls} w-full`}>
            <option value="">Select</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Topic C</label>
          <select value={form.tC} onChange={set("tC")} className={`${inputCls} w-full`}>
            <option value="">Select</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <button
          className="rounded-lg bg-gradient-to-b from-accent-hover to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110"
          onClick={submit}
        >
          📤 Submit for Review
        </button>
        <button
          className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
          onClick={clearForm}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
