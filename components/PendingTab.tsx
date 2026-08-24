"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsRecord, NewsType } from "@/lib/types";
import NewsCard from "./NewsCard";
import {
  approveNews,
  rejectNews,
  snoozeNews,
  unsnoozeNews,
  unscheduleNews,
} from "@/lib/newsActions";
import { useToast } from "./ToastProvider";

interface PendingTabProps {
  data: NewsRecord;
  topics: string[];
  active: boolean;
  onEdit: (key: string, type: NewsType) => void;
}

export default function PendingTab({ data, topics, active, onEdit }: PendingTabProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"active" | "snoozed">("active");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const { visibleData, snoozedData } = useMemo(() => {
    const visible: NewsRecord = {};
    const snoozed: NewsRecord = {};
    for (const [k, n] of Object.entries(data)) {
      if (n.snoozedUntil && n.snoozedUntil > now) snoozed[k] = n;
      else visible[k] = n;
    }
    return { visibleData: visible, snoozedData: snoozed };
  }, [data, now]);

  const source = view === "active" ? visibleData : snoozedData;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result: NewsRecord = {};
    for (const [k, n] of Object.entries(source)) {
      const matchesQ =
        !q ||
        (n.headLineEnglish || "").toLowerCase().includes(q) ||
        (n.newsSite || "").toLowerCase().includes(q);
      const matchesTopic =
        !topicFilter || [n.topicA, n.topicB, n.topicC].includes(topicFilter);
      if (matchesQ && matchesTopic) result[k] = n;
    }
    return result;
  }, [source, search, topicFilter]);

  const sortedKeys = useMemo(() => {
    return Object.keys(filtered).sort(
      (a, b) => (filtered[a].createdAt || 0) - (filtered[b].createdAt || 0)
    );
  }, [filtered]);

  if (!active) return null;

  const toggleSelect = (key: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const doApprove = async (key: string) => {
    try {
      await approveNews(key);
      toast("✅ Approved and published!");
    } catch (e) {
      toast("Error: " + (e as Error).message, "err");
    }
  };

  const doReject = async (key: string) => {
    if (!confirm("Reject?")) return;
    try {
      await rejectNews(key);
      toast("Rejected.");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const doSnooze = async (key: string, hours: number) => {
    try {
      await snoozeNews(key, hours);
      toast("😴 Snoozed.");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const doUnsnooze = async (key: string) => {
    try {
      await unsnoozeNews(key);
      toast("▶ Back in the queue.");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const doUnschedule = async (key: string) => {
    try {
      await unscheduleNews(key);
      toast("↩ Unscheduled.");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const bulkApprove = async () => {
    if (!confirm(`Approve ${selected.size}?`)) return;
    for (const k of selected) await approveNews(k);
    setSelected(new Set());
  };

  const bulkReject = async () => {
    if (!confirm(`Reject ${selected.size}?`)) return;
    for (const k of selected) await rejectNews(k);
    setSelected(new Set());
    toast("Rejected.");
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
            placeholder="Search..."
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
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <span className="whitespace-nowrap text-[11px] text-neutral-400 dark:text-neutral-600">
          {sortedKeys.length} results
        </span>
      </div>

      <div className="mb-3 flex gap-1.5">
        <button
          onClick={() => setView("active")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            view === "active"
              ? "bg-accent text-white"
              : "border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
          }`}
        >
          Pending ({Object.keys(visibleData).length})
        </button>
        <button
          onClick={() => setView("snoozed")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            view === "snoozed"
              ? "bg-accent text-white"
              : "border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
          }`}
        >
          😴 Snoozed ({Object.keys(snoozedData).length})
        </button>
      </div>

      {view === "active" && selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
          <span className="flex-1 text-xs text-neutral-500 dark:text-neutral-400">
            {selected.size} selected
          </span>
          <button
            className="rounded-md bg-green-500 px-3 py-1 text-[11px] font-bold text-black"
            onClick={bulkApprove}
          >
            ✓ Approve All
          </button>
          <button
            className="rounded-md border border-red-300 bg-red-500/10 px-3 py-1 text-[11px] font-bold text-red-500 dark:border-red-900"
            onClick={bulkReject}
          >
            ✗ Reject All
          </button>
        </div>
      )}

      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {view === "active" ? "Pending Approval" : "Snoozed"}
        </div>
        <div className="text-[11px] text-neutral-400 dark:text-neutral-600">
          {Object.keys(data).length} total
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sortedKeys.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-3 text-4xl">{view === "active" ? "🎉" : "😴"}</div>
            <div className="mb-1 text-base font-bold text-neutral-900 dark:text-neutral-100">
              {view === "active" ? "All clear!" : "Nothing snoozed"}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {view === "active" ? "No pending news" : "Snoozed items will show up here"}
            </div>
          </div>
        ) : (
          sortedKeys.map((k) => (
            <NewsCard
              key={k}
              itemKey={k}
              news={filtered[k]}
              type="pending"
              selected={selected.has(k)}
              snoozed={view === "snoozed"}
              onToggleSelect={toggleSelect}
              onApprove={doApprove}
              onReject={doReject}
              onDelete={() => {}}
              onEdit={onEdit}
              onSnooze={view === "active" ? doSnooze : undefined}
              onUnsnooze={doUnsnooze}
              onUnschedule={doUnschedule}
            />
          ))
        )}
      </div>
    </div>
  );
}
