"use client";

import { useEffect, useState } from "react";
import { Disc3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps { duration?: number; showOnce?: boolean; className?: string; onComplete?: () => void; }
const SPLASH_STORAGE_KEY = "concertix-splash-seen";

export function SplashScreen({ duration = 1800, showOnce = true, className, onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let hasSeen = false;
    if (showOnce && typeof window !== "undefined") {
      try { hasSeen = window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === "true"; if (!hasSeen) window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "true"); } catch { hasSeen = false; }
    }
    const finish = () => { setVisible(false); onComplete?.(); };
    const timer = window.setTimeout(finish, hasSeen ? 40 : duration);
    return () => window.clearTimeout(timer);
  }, [duration, onComplete, showOnce]);
  if (!visible) return null;
  return <div className={cn("splash-screen fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f4f8ff] text-[#102a43]", className)} role="status" aria-live="polite" aria-label="Memuat Concertix"><div className="splash-grid pointer-events-none absolute inset-0 opacity-80" /><div className="splash-halo pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/45 blur-3xl" /><div className="relative flex flex-col items-center px-6 text-center"><div className="splash-mark relative mb-8 flex h-20 w-20 items-center justify-center rounded-[26px] border border-blue-200 bg-blue-600 text-white shadow-[0_20px_50px_-20px_rgba(37,99,235,.65)]"><Disc3 className="h-10 w-10" /><span className="absolute h-2 w-2 rounded-full bg-blue-100" /></div><p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#2563eb]">CONCERTIX</p><h1 className="mt-4 font-display text-3xl tracking-[-0.03em] text-[#123b6d] sm:text-4xl">Your next moment awaits.</h1><p className="mt-3 max-w-xs text-xs leading-6 text-[#6683a3]">Menyiapkan pengalaman konser terbaik untukmu.</p><div className="mt-10 h-px w-48 overflow-hidden bg-blue-100"><div className="splash-progress h-full w-full origin-left bg-[#2563eb]" /></div><div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8aa4c1]"><Sparkles className="h-3 w-3 text-[#2563eb]" />Curated live experiences</div></div></div>;
}
