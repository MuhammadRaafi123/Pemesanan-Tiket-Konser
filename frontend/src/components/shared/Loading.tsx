import { Disc3 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Menyiapkan pengalaman konser...",
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div
      className="flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-primary/15" />
        <span
          className="absolute inset-0 rounded-full border border-primary/25"
          style={{ animation: "ripple 2.6s cubic-bezier(0.22,1,0.36,1) infinite" }}
        />
        <Disc3
          className="h-7 w-7 text-primary"
          style={{ animation: "spin 3.4s linear infinite" }}
        />
      </span>
      <p className="text-sm font-medium text-ink-soft">{message}</p>
      <p className="meta-label mt-3">Concertix</p>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 backdrop-blur-xl">{content}</div>;
  }

  return <div className="flex min-h-[300px] w-full items-center justify-center">{content}</div>;
}

export default Loading;
