"use client";

import type { NewsItem, NewsType } from "@/lib/types";
import { IconCheck, IconPencil, IconX, IconTrash } from "./icons";

interface NewsCardProps {
  itemKey: string;
  news: NewsItem;
  type: NewsType;
  selected: boolean;
  snoozed?: boolean;
  onToggleSelect: (key: string, checked: boolean) => void;
  onApprove: (key: string) => void;
  onReject: (key: string) => void;
  onDelete: (key: string) => void;
  onEdit: (key: string, type: NewsType) => void;
  onSnooze?: (key: string, hours: number) => void;
  onUnsnooze?: (key: string) => void;
  onUnschedule?: (key: string) => void;
}

const SNOOZE_OPTIONS = [
  { hours: 3, label: "3 hours" },
  { hours: 24, label: "Tomorrow" },
  { hours: 72, label: "3 days" },
];

export default function NewsCard({
  itemKey,
  news,
  type,
  selected,
  snoozed,
  onToggleSelect,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  onSnooze,
  onUnsnooze,
  onUnschedule,
}: NewsCardProps) {
  const thumb = news.thumbnail || news.thumb || "";
  const headEn = news.headLineEnglish || news.titleEnglish || news.title || "—";
  const headBn = news.headLineNepali || news.titleNepali || "";
  const shortTitle = news.titleEnglish || "";
  const dEn = news.descriptionEnglish || "";
  const topics = [news.topicA, news.topicB, news.topicC].filter(Boolean);
  const scheduled = type === "pending" && news.status === "scheduled" && !!news.publishAt;

  return (
    <div className="group flex items-stretch gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
      {type === "pending" && (
        <div className="flex shrink-0 items-start pl-3 pt-3.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onToggleSelect(itemKey, e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
        </div>
      )}
      <div className="h-28 w-28 shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 sm:h-auto sm:w-32">
        {thumb ? (
          <img
            src={thumb}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget.parentNode as HTMLElement).innerHTML =
                '<div class="flex h-full w-full items-center justify-center text-2xl text-neutral-300">📰</div>';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-neutral-300 dark:text-neutral-700">
            📰
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {news.newsSite && (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              {news.newsSite}
            </span>
          )}
          {news.author && news.author !== "Auto" && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              ✍️ {news.author}
            </span>
          )}
          {type === "pending" ? (
            scheduled ? (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                📅 Scheduled: {new Date(news.publishAt!).toLocaleString()}
              </span>
            ) : snoozed ? (
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                😴 Snoozed until {new Date(news.snoozedUntil!).toLocaleString()}
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                ⏳ Pending
              </span>
            )
          ) : (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
              ✅ Published
            </span>
          )}
          {topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {headEn}
        </div>
        {headBn && (
          <div className="line-clamp-1 font-bangla text-xs text-neutral-500 dark:text-neutral-400">
            {headBn}
          </div>
        )}
        {shortTitle && shortTitle !== headEn && (
          <div className="truncate text-[11px] font-semibold text-accent">↳ {shortTitle}</div>
        )}
        {dEn && (
          <div className="line-clamp-1 text-[11px] text-neutral-500 dark:text-neutral-400">{dEn}</div>
        )}
        {news.url && (
          <a
            href={news.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 truncate text-[10px] text-blue-500 hover:underline"
          >
            🔗 {news.url}
          </a>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {type === "pending" ? (
            scheduled ? (
              <>
                <button
                  className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
                  onClick={() => onEdit(itemKey, "pending")}
                >
                  <IconPencil className="h-3 w-3" /> Edit
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                  onClick={() => onUnschedule?.(itemKey)}
                >
                  ↩ Unschedule
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                  onClick={() => onReject(itemKey)}
                >
                  <IconX className="h-3 w-3" /> Reject
                </button>
              </>
            ) : snoozed ? (
              <>
                <button
                  className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
                  onClick={() => onEdit(itemKey, "pending")}
                >
                  <IconPencil className="h-3 w-3" /> Edit
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-green-500 px-2.5 py-1 text-[11px] font-semibold text-black transition hover:opacity-85"
                  onClick={() => onUnsnooze?.(itemKey)}
                >
                  ▶ Show now
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                  onClick={() => onReject(itemKey)}
                >
                  <IconX className="h-3 w-3" /> Reject
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex items-center gap-1 rounded-md bg-green-500 px-2.5 py-1 text-[11px] font-semibold text-black transition hover:opacity-85"
                  onClick={() => onApprove(itemKey)}
                >
                  <IconCheck className="h-3 w-3" /> Approve
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
                  onClick={() => onEdit(itemKey, "pending")}
                >
                  <IconPencil className="h-3 w-3" /> Edit
                </button>
                <button
                  className="flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                  onClick={() => onReject(itemKey)}
                >
                  <IconX className="h-3 w-3" /> Reject
                </button>
                {onSnooze && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const hours = Number(e.target.value);
                      if (hours) onSnooze(itemKey, hours);
                      e.target.value = "";
                    }}
                    className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-[11px] font-medium text-neutral-500 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    <option value="" disabled>
                      😴 Snooze...
                    </option>
                    {SNOOZE_OPTIONS.map((o) => (
                      <option key={o.hours} value={o.hours}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )
          ) : (
            <>
              <button
                className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
                onClick={() => onEdit(itemKey, "published")}
              >
                <IconPencil className="h-3 w-3" /> Edit
              </button>
              <button
                className="flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                onClick={() => onDelete(itemKey)}
              >
                <IconTrash className="h-3 w-3" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
