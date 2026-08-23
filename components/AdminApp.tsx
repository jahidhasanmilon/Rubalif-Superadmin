"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useNewsData } from "@/hooks/useNewsData";
import LoginScreen from "./LoginScreen";
import Sidebar, { type Tab } from "./Sidebar";
import Topbar from "./Topbar";
import DashboardTab from "./DashboardTab";
import type { NewsType } from "@/lib/types";

const PendingTab = dynamic(() => import("./PendingTab"));
const PublishedTab = dynamic(() => import("./PublishedTab"));
const AddNewsTab = dynamic(() => import("./AddNewsTab"));
const AddMagazineTab = dynamic(() => import("./AddMagazineTab"));
const SettingsTab = dynamic(() => import("./SettingsTab"));
const EditModal = dynamic(() => import("./EditModal"));

export default function AdminApp() {
  const { user, authReady, logout } = useAuth();
  const { pending, published } = useNewsData();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("rubalif-theme") !== "light";
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editTarget, setEditTarget] = useState<{ key: string; type: NewsType } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("rubalif-theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  if (!authReady) return null;

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="mesh-bg flex h-dvh w-full overflow-hidden bg-white dark:bg-neutral-950 md:gap-3 md:bg-neutral-100 md:p-3">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        pendingCount={Object.keys(pending).length}
        onLogout={logout}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-neutral-200/60 bg-white dark:border-neutral-800/60 dark:bg-neutral-900 md:rounded-2xl md:border md:shadow-xl md:shadow-black/5 dark:md:shadow-black/40">
        <Topbar
          activeTab={activeTab}
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          user={user}
          onLogout={logout}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DashboardTab
            pending={pending}
            published={published}
            isDark={isDark}
            active={activeTab === "dashboard"}
            onViewPending={() => setActiveTab("pending")}
          />
          <PendingTab
            data={pending}
            active={activeTab === "pending"}
            onEdit={(key, type) => setEditTarget({ key, type })}
          />
          <PublishedTab
            data={published}
            active={activeTab === "published"}
            onEdit={(key, type) => setEditTarget({ key, type })}
          />
          <AddNewsTab active={activeTab === "add"} />
          <AddMagazineTab active={activeTab === "addMagazine"} />
          <SettingsTab
            active={activeTab === "settings"}
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((c) => !c)}
            user={user}
            onLogout={logout}
            pendingCount={Object.keys(pending).length}
            publishedCount={Object.keys(published).length}
          />
        </div>
      </div>
      <EditModal target={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  );
}
