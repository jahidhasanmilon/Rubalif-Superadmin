"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNewsData } from "@/hooks/useNewsData";
import LoginScreen from "./LoginScreen";
import Sidebar, { type Tab } from "./Sidebar";
import Topbar from "./Topbar";
import DashboardTab from "./DashboardTab";
import PendingTab from "./PendingTab";
import PublishedTab from "./PublishedTab";
import AddNewsTab from "./AddNewsTab";
import SettingsTab from "./SettingsTab";
import EditModal from "./EditModal";
import type { NewsType } from "@/lib/types";

export default function AdminApp() {
  const { user, authReady, logout } = useAuth();
  const { pending, published } = useNewsData();

  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editTarget, setEditTarget] = useState<{ key: string; type: NewsType } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  if (!authReady) return null;

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-neutral-100 p-3 dark:bg-neutral-950">
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
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-black/5 dark:border-neutral-800/60 dark:bg-neutral-900 dark:shadow-black/40">
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
