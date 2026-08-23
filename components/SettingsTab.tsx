"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { useToast } from "./ToastProvider";

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
}: SettingsTabProps) {
  const toast = useToast();
  const [running, setRunning] = useState(false);

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
