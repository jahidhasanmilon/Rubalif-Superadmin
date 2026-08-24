"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { useToast } from "./ToastProvider";
import { useAutomationLog } from "@/hooks/useAutomationLog";
import { IconZap } from "./icons";

interface AutomationTabProps {
  active: boolean;
  user: User | null;
}

interface RunResult {
  added: number;
  alreadyExists: number;
  errors: number;
  log: string[];
  finishedAt: string;
}

const PIPELINE_STEPS = [
  { icon: "📡", label: "RSS Feeds", sub: "16 sources" },
  { icon: "🧹", label: "Smart Filter", sub: "skip noise" },
  { icon: "🤖", label: "Claude AI", sub: "translate + summarize" },
  { icon: "📥", label: "Auto-Queue", sub: "ready to publish" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return Math.floor(diff / 86400000) + "d ago";
}

export default function AutomationTab({ active, user }: AutomationTabProps) {
  const toast = useToast();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const runs = useAutomationLog();

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
      setResult(data);
      toast(`✅ Added ${data.added}, skipped ${data.alreadyExists}, errors ${data.errors}`);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-accent/5 via-transparent to-blue-500/5 p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <IconZap className="h-[18px] w-[18px]" />
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            AI News Automation
          </div>
        </div>
        <div className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
          Fetches Bangladeshi &amp; international RSS feeds, filters out noise, and asks Claude
          to translate + summarize each story into English and Bengali before it lands in the
          review queue.
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="relative">
              <div className="flex h-full flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white p-3 text-center dark:border-neutral-700 dark:bg-neutral-800/60">
                <div className="text-xl">{step.icon}</div>
                <div className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100">
                  {step.label}
                </div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-600">{step.sub}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="pointer-events-none absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-neutral-300 dark:text-neutral-700 sm:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full rounded-lg bg-gradient-to-b from-accent-hover to-accent py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
          onClick={runAutomation}
          disabled={running}
        >
          {running ? "⏳ Running pipeline..." : "▶ Run automation now"}
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
          <div className="mb-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-500/10 p-3 text-center">
              <div className="text-xl font-extrabold text-green-600 dark:text-green-400">
                {result.added}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Added</div>
            </div>
            <div className="rounded-lg bg-neutral-100 p-3 text-center dark:bg-neutral-800">
              <div className="text-xl font-extrabold text-neutral-600 dark:text-neutral-300">
                {result.alreadyExists}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Skipped</div>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3 text-center">
              <div className="text-xl font-extrabold text-red-500">{result.errors}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Errors</div>
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg bg-neutral-950 p-3 font-mono text-[11px] leading-relaxed text-green-400">
            {result.log.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
          <div className="mt-2 text-right text-[10px] text-neutral-400 dark:text-neutral-600">
            Finished {new Date(result.finishedAt).toLocaleTimeString()}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Last Run Status
          </div>
          {runs[0] && (
            <div
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                runs[0].errors > 0
                  ? "bg-red-500/10 text-red-500"
                  : "bg-green-500/10 text-green-600 dark:text-green-400"
              }`}
            >
              {runs[0].errors > 0 ? `${runs[0].errors} error(s)` : "Healthy"}
            </div>
          )}
        </div>

        {runs.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400 dark:text-neutral-600">
            No automation runs logged yet — trigger one above, or wait for the daily cron.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {runs.slice(0, 10).map((run) => (
              <div key={run.key} className="py-2 first:pt-0 last:pb-0">
                <div
                  className="flex cursor-pointer items-center gap-2.5"
                  onClick={() => setExpanded((k) => (k === run.key ? null : run.key))}
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      run.trigger === "cron"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {run.trigger === "cron" ? "⏰ Cron" : "▶ Manual"}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {timeAgo(run.finishedAt)}
                  </span>
                  {run.trigger === "manual" && run.triggeredBy && (
                    <span className="hidden truncate text-[11px] text-neutral-400 dark:text-neutral-600 sm:inline">
                      by {run.triggeredBy}
                    </span>
                  )}
                  <span className="ml-auto flex shrink-0 items-center gap-2 text-[11px] font-medium">
                    <span className="text-green-600 dark:text-green-400">+{run.added}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">{run.alreadyExists} skip</span>
                    {run.errors > 0 && <span className="text-red-500">{run.errors} err</span>}
                  </span>
                </div>
                {expanded === run.key && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-neutral-950 p-3 font-mono text-[11px] leading-relaxed text-green-400">
                    {run.log.map((line, i) => (
                      <div key={i} className="whitespace-pre-wrap">
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
