import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Terjadi kesalahan",
  message = "Gagal memuat data. Silakan coba lagi beberapa saat lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Reveal variant="soft">
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-rose-100 bg-rose-50/40 px-8 py-14 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </span>

        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{message}</p>

        {onRetry ? (
          <Button onClick={onRetry} variant="secondary" className="mt-7 gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
        ) : null}
      </div>
    </Reveal>
  );
}

export default ErrorState;
