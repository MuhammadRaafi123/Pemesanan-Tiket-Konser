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

export function SplashScreen({
  duration = 1900,
  showOnce = true,
  className,
  onComplete,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

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

    const fadeTimer = window.setTimeout(() => {
      setFading(true);
    }, Math.max(0, duration - 350));

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [duration, onComplete, showOnce]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "splash-screen fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0b0e15] text-[#e1e2ec] transition-opacity duration-300 ease-out",
        fading ? "opacity-0 pointer-events-none" : "opacity-100",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Memuat Tixora"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb703]/[0.09] blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-[#6801d1]/[0.10] blur-[90px]" />

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Foto / Logo Tixora */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-[#ffb703]/15 blur-2xl animate-pulse" />
          <Image
            src="/tixora.png"
            alt="Tixora"
            width={260}
            height={158}
            priority
            className="relative h-auto w-52 sm:w-60 md:w-64 object-contain drop-shadow-[0_12px_36px_rgba(255,183,3,0.28)]"
          />
        </div>

        <h1 className="sr-only">Tixora</h1>

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-[#ffb703]">
          Your next moment awaits.
        </p>
        <p className="mt-3 max-w-xs text-xs leading-6 text-[#8a8d98]">
          Menyiapkan pengalaman konser terbaik untukmu.
        </p>

        {/* Loading progress bar */}
        <div className="mt-8 h-1 w-52 overflow-hidden rounded-full bg-[#1e2128] border border-[#2a2d36]/60">
          <div className="splash-progress h-full w-full origin-left rounded-full bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703]" />
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
