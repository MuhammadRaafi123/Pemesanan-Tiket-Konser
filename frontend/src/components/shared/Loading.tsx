import React from "react";
import { Disc3 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Memuat pengalaman konser...",
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        {/* Glowing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-400 opacity-30 blur-xl" />
        
        {/* Spinning vinyl disc icon */}
        <Disc3 className="h-14 w-14 text-purple-400" />
        
        {/* Center dot */}
        <div className="absolute h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      </div>

      {/* Audio Wave Visualizer Bars */}
      <div className="flex h-5 items-center gap-1 mb-3">
        <span className="w-1 rounded-full bg-purple-500" />
        <span className="w-1 rounded-full bg-pink-500" />
        <span className="w-1 rounded-full bg-cyan-400" />
        <span className="w-1 rounded-full bg-purple-400" />
        <span className="w-1 rounded-full bg-pink-400" />
      </div>

      <p className="text-sm font-medium text-white/70 tracking-wide">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080c]/90 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[350px] w-full items-center justify-center">
      {content}
    </div>
  );
}
export default Loading;
