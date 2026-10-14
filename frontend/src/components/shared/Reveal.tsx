"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "left" | "right" | "scale" | "soft";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the element animates in. */
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  as?: ElementType;
  /** Replay the animation every time the element re-enters the viewport. */
  repeat?: boolean;
}

const useInView = <T extends HTMLElement>(options?: { repeat?: boolean }) => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  const { repeat = false } = options ?? {};

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setShown(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [repeat]);

  return { ref, shown };
};

/**
 * Fades + lifts its children into view the first time they enter the viewport.
 * The hidden state lives behind `html.js-ready` in CSS, so server-rendered
 * markup is never trapped invisible when JavaScript is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  className,
  as: Tag = "div",
  repeat = false,
}: RevealProps) {
  const { ref, shown } = useInView<HTMLElement>({ repeat });

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "in" : variant}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Milliseconds added per child. */
  step?: number;
  as?: ElementType;
}

/** Reveals direct children one after another when the group scrolls into view. */
export function Stagger({ children, className, step = 70, as: Tag = "div" }: StaggerProps) {
  const { ref, shown } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn("stagger", shown && "is-in", className)}
      style={{ "--stagger-step": `${step}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
