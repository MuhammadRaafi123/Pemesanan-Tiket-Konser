"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, "success"), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, "error"), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ toast: showToast, success, error, info }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all ${
              t.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-200"
                : t.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800 shadow-rose-200"
                : "border-blue-200 bg-blue-50 text-[#17457f] shadow-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
              {t.type === "info" && <Info className="h-5 w-5 text-[#2563eb] shrink-0" />}
              <p className="text-sm font-medium leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="rounded-lg p-1 text-[#8aa4c1] hover:bg-blue-50 hover:text-[#2563eb] transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
