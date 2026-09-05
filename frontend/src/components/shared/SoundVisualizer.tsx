"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface SoundVisualizerProps {
  interactive?: boolean;
  barCount?: number;
  className?: string;
}

export function SoundVisualizer({
  interactive = true,
  barCount = 12,
  className = "",
}: SoundVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      onClick={() => interactive && setIsPlaying(!isPlaying)}
      className={`inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 backdrop-blur-md transition-all duration-300 ${
        interactive ? "cursor-pointer hover:border-purple-400 hover:bg-purple-900/40 active:scale-95" : ""
      } ${className}`}
      title={interactive ? (isPlaying ? "Klik untuk pause vibe" : "Klik untuk mainkan vibe") : undefined}
    >
      <div className="flex h-4 items-center gap-[3px]">
        {Array.from({ length: barCount }).map((_, i) => {
          // Dynamic height patterns
          const heights = [14, 22, 10, 26, 18, 12, 24, 16, 20, 8, 26, 14];
          const delays = [0.1, 0.4, 0.2, 0.5, 0.3, 0.6, 0.15, 0.45, 0.25, 0.55, 0.35, 0.65];
          const height = heights[i % heights.length];
          const delay = delays[i % delays.length];

          return (
            <span
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-purple-500 via-pink-400 to-cyan-300 transition-all"
              style={{
                height: isPlaying ? `${height}px` : "4px",
                animation: isPlaying ? `soundwave 1.1s ease-in-out infinite` : "none",
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200">
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        <span className="hidden sm:inline tracking-wide uppercase text-[10px] font-bold text-purple-300">
          Live Beats
        </span>
        {interactive && (
          isPlaying ? (
            <Volume2 className="h-3.5 w-3.5 text-purple-400" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-white/40" />
          )
        )}
      </div>
    </div>
  );
}
