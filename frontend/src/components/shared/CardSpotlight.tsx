"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export function CardSpotlight({
  children,
  spotlightColor = "rgba(37, 99, 235, 0.14)",
  className,
  ...props
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setCoords({ x: -1000, y: -1000 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 text-[#102a43] shadow-[0_18px_50px_-30px_rgba(37,99,235,.35)] backdrop-blur-xl transition-all duration-300 hover:border-blue-300 hover:shadow-[0_20px_48px_-28px_rgba(37,99,235,.4)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
