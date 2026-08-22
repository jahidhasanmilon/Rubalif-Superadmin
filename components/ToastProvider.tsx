"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastType = "" | "err" | "info";

interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

const ToastContext = createContext<((msg: string, type?: ToastType) => void) | null>(null);

const BORDER_COLOR: Record<ToastType, string> = {
  "": "border-l-green-500",
  err: "border-l-red-500",
  info: "border-l-blue-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((msg: string, type: ToastType = "") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-1.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in min-w-52 rounded-lg border border-l-[3px] border-neutral-200 bg-white p-3 text-xs font-medium text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 ${BORDER_COLOR[t.type]}`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
