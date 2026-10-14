"use client";

import { useEffect, useState } from "react";

/**
 * Thin reading-progress rail for the top of the viewport.
 * Width is driven by scroll position with a short CSS transition so the bar
 * glides instead of ticking.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
        setProgress(Math.min(Math.max(ratio, 0), 1));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/10 ${className ?? ""}`}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-[#3f6fe0] to-gold-soft transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

export default ScrollProgress;
