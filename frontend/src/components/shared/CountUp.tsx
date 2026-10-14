"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  /** Renders the value with this formatter. Defaults to Indonesian grouping. */
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts from zero to `value` once the element scrolls into view.
 * The formatter receives the running number, so currency strings such as
 * "Rp 1.500.000" animate digit by digit instead of snapping into place.
 */
export function CountUp({ value, format, duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(() => render(0, format));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Nothing to animate: the initial state already matches the target.
    if (value === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setDisplay(render(value, format)), 0);
      return () => window.clearTimeout(fallback);
    }

    let frame = 0;
    let start: number | null = null;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        if (reduce) {
          setDisplay(render(value, format));
          return;
        }

        const tick = (now: number) => {
          if (start === null) start = now;
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(render(Math.round(value * easeOutExpo(progress)), format));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, format, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function render(value: number, format?: (value: number) => string) {
  return format ? format(value) : value.toLocaleString("id-ID");
}

export default CountUp;
