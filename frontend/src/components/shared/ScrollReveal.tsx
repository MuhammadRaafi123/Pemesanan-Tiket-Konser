"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { "--scroll-reveal-delay": `${delay}ms` } as CSSProperties;

  return <div ref={elementRef} style={style} className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

export default ScrollReveal;
