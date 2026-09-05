import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data. Silakan coba lagi beberapa saat lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/60 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 gap-2 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
export default ErrorState;
