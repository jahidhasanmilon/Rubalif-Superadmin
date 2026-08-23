"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErr, setShowErr] = useState(false);

  const doLogin = async () => {
    setShowErr(false);
    try {
      await login(email, password);
    } catch {
      setShowErr(true);
    }
  };

  return (
    <div className="mesh-bg flex h-dvh w-full items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden w-80 shrink-0 flex-col justify-between bg-gradient-to-br from-accent to-red-700 p-10 sm:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold text-white">
              R
            </div>
            <div className="text-xl font-bold text-white">Rubalif</div>
          </div>
          <div>
            <div className="mb-2 text-2xl font-bold leading-tight text-white">
              Superadmin Control Panel
            </div>
            <div className="text-sm leading-relaxed text-white/80">
              Manage your news, approve content, and keep Rubalif running smoothly.
            </div>
          </div>
          <div className="text-xs text-white/50">© 2026 Rubalif Media</div>
        </div>
        <div className="flex flex-1 flex-col justify-center bg-white p-8 dark:bg-neutral-900 sm:p-10">
          <div className="mb-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Welcome back
          </div>
          <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to your admin account
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Email
            </label>
            <input
              type="email"
              placeholder="superadmin@rubalif.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-accent dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
          <div className="mb-3.5">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doLogin();
              }}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-accent dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
          <button
            className="mt-1.5 w-full rounded-lg bg-gradient-to-b from-accent-hover to-accent py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/30 transition hover:brightness-110"
            onClick={doLogin}
          >
            Sign in →
          </button>
          {showErr && (
            <p className="mt-2 text-xs text-red-500">⚠️ Invalid email or password</p>
          )}
        </div>
      </div>
    </div>
  );
}
