"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { useToast } from "./ToastProvider";
import { addTopic, removeTopic } from "@/lib/topicsActions";

interface SettingsTabProps {
  active: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: User | null;
  onLogout: () => void;
  pendingCount: number;
  publishedCount: number;
  topics: string[];
}

export default function SettingsTab({
  active,
  isDark,
  onToggleTheme,
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  pendingCount,
  publishedCount,
  topics,
}: SettingsTabProps) {
  const toast = useToast();
  const [running, setRunning] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  if (!active) return null;

  const runAutomation = async () => {
    if (!user) return;
    setRunning(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/run-automation", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Automation failed");
      toast(`✅ Added ${data.added}, skipped ${data.alreadyExists}, errors ${data.errors}`);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setRunning(false);
    }
  };

  const handleAddTopic = async () => {
    const name = newTopic.trim();
    if (!name) return;
    try {
      await addTopic(topics, name);
      setNewTopic("");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  const handleRemoveTopic = async (topic: string) => {
    try {
      await removeTopic(topics, topic);
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  return (
    <div className="max-w-xl rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="mb-4 border-b border-neutral-100 pb-3 text-sm font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        ⚙️ Settings
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Theme</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Dark or light mode</div>
          </div>
          <button
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            onClick={onToggleTheme}
          >
            {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sidebar</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Close sidebar or Open sidebar
            </div>
          </div>
          <button
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? "› Open sidebar" : "‹ Close sidebar"}
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Account</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{user?.email || ""}</div>
          </div>
          <button
            className="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-500 hover:border-red-300 hover:text-red-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            onClick={onLogout}
          >
            Sign out
          </button>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div className="mb-2.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Database
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-accent/10 p-3">
              <div className="mb-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">Pending</div>
              <div className="text-xl font-bold text-accent">{pendingCount}</div>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <div className="mb-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">Published</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {publishedCount}
              </div>
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-neutral-400 dark:text-neutral-600">
            🌐 Region: Asia Southeast 1
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div className="mb-2.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Topics
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400"
              >
                {t}
                <button
                  onClick={() => handleRemoveTopic(t)}
                  className="text-blue-600/70 hover:text-red-500 dark:text-blue-400/70"
                  aria-label={`Remove ${t}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New topic name"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTopic();
              }}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <button
              className="rounded-lg bg-gradient-to-b from-accent-hover to-accent px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110"
              onClick={handleAddTopic}
            >
              + Add
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              News Automation
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Fetch RSS feeds and queue new news right now
            </div>
          </div>
          <button
            className="rounded-lg bg-gradient-to-b from-accent-hover to-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={runAutomation}
            disabled={running}
          >
            {running ? "⏳ Running..." : "▶ Run automation now"}
          </button>
        </div>
      </div>
    </div>
  );
}
