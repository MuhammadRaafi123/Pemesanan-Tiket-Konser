"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
}

/**
 * Infinite ticker. The track is duplicated once and translated by exactly -50%,
 * so the loop is seamless; hovering pauses it so text stays readable.
 */
export function Marquee({ items, className, itemClassName, reverse = false }: MarqueeProps) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className={cn("marquee-track", reverse && "[animation-direction:reverse]")}
        style={{ gap: "3.5rem" }}
      >
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className={cn("flex shrink-0 items-center gap-3", itemClassName)}
          >
            <span className="h-1 w-1 rounded-full bg-gold-soft" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
