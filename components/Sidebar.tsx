"use client";

import type { User } from "firebase/auth";

export type Tab = "dashboard" | "pending" | "published" | "add" | "settings";

interface SidebarProps {
  user: User | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingCount: number;
  onLogout: () => void;
}

const NAV_GROUPS: { label: string; items: { tab: Tab; icon: string; label: string; badge?: boolean }[] }[] = [
  { label: "Overview", items: [{ tab: "dashboard", icon: "📊", label: "Dashboard" }] },
  {
    label: "News",
    items: [
      { tab: "pending", icon: "⏳", label: "Pending", badge: true },
      { tab: "published", icon: "✅", label: "Published" },
      { tab: "add", icon: "＋", label: "Add News" },
    ],
  },
  { label: "Account", items: [{ tab: "settings", icon: "⚙️", label: "Settings" }] },
];

export default function Sidebar({
  user,
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  pendingCount,
  onLogout,
}: SidebarProps) {
  const name = user?.displayName || user?.email || "Admin";

  const select = (tab: Tab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-neutral-200 bg-white transition-[width,transform] duration-200 dark:border-neutral-800 dark:bg-neutral-900 md:static md:h-full md:w-60 md:translate-x-0 md:rounded-2xl md:border md:shadow-xl md:shadow-black/5 dark:md:shadow-black/40 ${
          isCollapsed ? "md:w-16" : "md:w-60"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-200 px-4 dark:border-neutral-800">
          <div
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent text-sm font-bold text-white"
            onClick={() => isCollapsed && onToggleCollapse()}
          >
            R
          </div>
          {!isCollapsed && (
            <>
              <span className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Rubalif
              </span>
              <button
                className="ml-auto hidden rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 md:block"
                onClick={onToggleCollapse}
              >
                ‹
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-2 py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <span className="mb-1 block px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                  {group.label}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activeTab === item.tab;
                  return (
                    <div
                      key={item.tab}
                      onClick={() => select(item.tab)}
                      className={`group relative flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        active
                          ? "bg-accent/10 text-accent dark:text-red-400"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-accent" />
                      )}
                      <span className="w-[18px] shrink-0 text-center text-[14px]">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.badge && pendingCount > 0 && (
                            <span className="ml-auto shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {pendingCount}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-800">
          <div
            className={`flex items-center gap-2.5 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800/60 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {user?.photoURL ? (
              <img className="h-8 w-8 shrink-0 rounded-full object-cover" src={user.photoURL} alt="" />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <div className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {name}
                </div>
                <div className="truncate text-[10px] text-neutral-400 dark:text-neutral-600">
                  Superadmin
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              className="mt-1.5 w-full rounded-md border border-neutral-200 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-red-800 dark:hover:text-red-400"
              onClick={onLogout}
            >
              Sign out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
