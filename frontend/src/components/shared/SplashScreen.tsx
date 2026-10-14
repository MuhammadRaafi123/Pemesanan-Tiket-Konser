"use client";

import { useEffect, useState } from "react";
import { Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  duration?: number;
  showOnce?: boolean;
  className?: string;
  onComplete?: () => void;
}

const SPLASH_STORAGE_KEY = "concertix-splash-seen";

export function SplashScreen({
  duration = 1700,
  showOnce = true,
  className,
  onComplete,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hasSeen = false;
    if (showOnce && typeof window !== "undefined") {
      try {
        hasSeen = window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === "true";
        if (!hasSeen) window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      } catch {
        hasSeen = false;
      }
    }

    const finish = () => {
      setVisible(false);
      onComplete?.();
    };

    const timer = window.setTimeout(finish, hasSeen ? 40 : duration);
    return () => window.clearTimeout(timer);
  }, [duration, onComplete, showOnce]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "splash-screen fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background text-ink",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Memuat Concertix"
    >
      <div className="splash-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="splash-mark relative mb-9 flex h-20 w-20 items-center justify-center rounded-[26px] border border-primary/20 bg-primary text-white shadow-[0_24px_60px_-24px_rgba(27,69,199,.75)]">
          <Disc3 className="h-9 w-9" />
          <span className="absolute h-2 w-2 rounded-full bg-white/80" />
        </div>

        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-primary">
          Concertix
        </p>
        <h1 className="font-display-xl mt-4 text-3xl text-ink sm:text-[2.6rem]">
          Your next moment awaits.
        </h1>
        <p className="mt-4 max-w-xs text-xs leading-6 text-muted-foreground">
          Menyiapkan pengalaman konser terbaik untukmu.
        </p>

        <div className="mt-10 h-px w-52 overflow-hidden bg-primary/10">
          <div className="splash-progress h-full w-full origin-left bg-gradient-to-r from-primary to-gold-soft" />
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
