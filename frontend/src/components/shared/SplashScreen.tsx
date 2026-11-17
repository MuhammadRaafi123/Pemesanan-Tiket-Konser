"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  duration?: number;
  showOnce?: boolean;
  className?: string;
  onComplete?: () => void;
}

const SPLASH_STORAGE_KEY = "tixora-splash-seen";
const OPEN_DURATION = 1100;

export function SplashScreen({
  duration = 3000,
  showOnce = true,
  className,
  onComplete,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let hasSeen = false;
    if (showOnce && typeof window !== "undefined") {
      try {
        hasSeen =
          window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === "true" ||
          window.sessionStorage.getItem("concertix-splash-seen") === "true";
        if (!hasSeen) window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      } catch {
        hasSeen = false;
      }
    }

    if (hasSeen) {
      const skipTimer = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 0);
      return () => window.clearTimeout(skipTimer);
    }

    const openTimer = window.setTimeout(() => {
      setOpening(true);
    }, Math.max(0, duration - OPEN_DURATION));

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(finishTimer);
    };
  }, [duration, onComplete, showOnce]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "splash-screen fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden text-white",
        opening && "splash-screen-opening",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Memuat Tixora"
    >
      <div
        aria-hidden="true"
        className="splash-shutter splash-shutter-left"
      />
      <div
        aria-hidden="true"
        className="splash-shutter splash-shutter-right"
      />
      <div className="splash-exit-content relative z-10 flex w-[min(100%-2rem,32rem)] flex-col items-center">
        <div className="splash-content flex w-full flex-col items-center px-6 py-10 text-center">
          <div className="relative mb-7 flex items-center justify-center">
            <Image
              src="/tixora1.png"
              alt="Tixora"
              width={260}
              height={158}
              priority
              className="relative h-auto w-56 object-contain drop-shadow-[0_0_36px_rgba(168,85,247,0.35)] sm:w-72"
            />
          </div>

          <h1 className="sr-only">Tixora</h1>

          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c084fc]">
            Your next moment awaits.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#c4b8d5]">
            Menyiapkan pengalaman konser terbaik untukmu.
          </p>

          <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full border border-[#a855f7]/25 bg-[#21162f]">
            <div
              className="splash-progress h-full w-full origin-left rounded-full bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#a855f7] shadow-[0_0_14px_rgba(192,132,252,0.65)]"
              style={{
                animationDuration: `${Math.max(1, duration - OPEN_DURATION)}ms`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
