"use client";

import { useMemo, useState } from "react";
import type { NewsRecord, NewsType } from "@/lib/types";
import { TOPICS } from "@/lib/constants";
import NewsCard from "./NewsCard";
import { deletePublished } from "@/lib/newsActions";
import { useToast } from "./ToastProvider";

interface PublishedTabProps {
  data: NewsRecord;
  active: boolean;
  onEdit: (key: string, type: NewsType) => void;
}

export default function PublishedTab({ data, active, onEdit }: PublishedTabProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result: NewsRecord = {};
    for (const [k, n] of Object.entries(data)) {
      const matchesQ =
        !q ||
        (n.title || n.headLineEnglish || "").toLowerCase().includes(q) ||
        (n.newsSite || "").toLowerCase().includes(q);
      const matchesTopic =
        !topicFilter || [n.topicA, n.topicB, n.topicC].includes(topicFilter);
      if (matchesQ && matchesTopic) result[k] = n;
    }
    return result;
  }, [data, search, topicFilter]);

  const displayKeys = useMemo(() => Object.keys(filtered).slice(-60).reverse(), [filtered]);

  if (!active) return null;

  const doDelete = async (key: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deletePublished(key);
      toast("🗑️ Deleted.");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-40 flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search published..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <select
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-600 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        >
          <option value="">All topics</option>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <span className="whitespace-nowrap text-[11px] text-neutral-400 dark:text-neutral-600">
          {Object.keys(filtered).length} results
        </span>
      </div>

      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          Published News
        </div>
        <div className="text-[11px] text-neutral-400 dark:text-neutral-600">
          {Object.keys(data).length} published
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {displayKeys.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-3 text-4xl">📰</div>
            <div className="mb-1 text-base font-bold text-neutral-900 dark:text-neutral-100">
              No published news
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Approve some news first
            </div>
          </div>
        ) : (
          displayKeys.map((k) => (
            <NewsCard
              key={k}
              itemKey={k}
              news={filtered[k]}
              type="published"
              selected={false}
              onToggleSelect={() => {}}
              onApprove={() => {}}
              onReject={() => {}}
              onDelete={doDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
