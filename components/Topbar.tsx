"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import type { Tab } from "./Sidebar";
import { IconMenu, IconSun, IconMoon, IconLogOut } from "./icons";

const TITLES: Record<Tab, string> = {
  dashboard: "Dashboard",
  pending: "Pending",
  published: "Published",
  add: "Add News",
  settings: "Settings",
};

interface TopbarProps {
  activeTab: Tab;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenMobileSidebar: () => void;
  user: User | null;
  onLogout: () => void;
}

export default function Topbar({
  activeTab,
  isDark,
  onToggleTheme,
  onOpenMobileSidebar,
  user,
  onLogout,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = user?.displayName || user?.email || "Admin";

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/60 px-4 dark:border-neutral-800/60 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
          onClick={onOpenMobileSidebar}
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {TITLES[activeTab]}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Live
        </div>
        <button
          className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 transition hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-100"
          onClick={onToggleTheme}
        >
          {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
        </button>
        <div className="relative">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {name.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <div className="truncate px-2 py-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </div>
                <button
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium text-red-500 hover:bg-red-500/10"
                  onClick={onLogout}
                >
                  <IconLogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
