"use client";

import React, { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

/**
 * Card surface with a cursor-following highlight.
 * Pointer position is written straight to CSS custom properties so hovering
 * never triggers a React re-render.
 */
export function CardSpotlight({
  children,
  spotlightColor = "rgba(27, 69, 199, 0.08)",
  className,
  ...props
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-3xl border border-border bg-white p-7 text-ink shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-28px_rgba(13,38,84,.26)] transition-all duration-500 hover:border-primary/20 hover:shadow-[0_2px_6px_rgba(10,27,51,.05),0_30px_64px_-32px_rgba(13,38,84,.36)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${spotlightColor}, transparent 68%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CardSpotlight;
