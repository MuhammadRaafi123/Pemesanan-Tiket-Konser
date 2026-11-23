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
      className="flex flex-col items-center justify-center px-5 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="relative mb-5 flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-[#c8b7db]/60" />
        <span
          className="absolute inset-0 rounded-full border border-[#6264b5]/25"
          style={{ animation: "ripple 2.6s cubic-bezier(0.22,1,0.36,1) infinite" }}
        />
        <Disc3
          className="h-6 w-6 text-[#6264b5]"
          style={{ animation: "spin 3.4s linear infinite" }}
        />
      </span>
      <p className="text-sm font-semibold text-[#071653]">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fffdf2]/95 px-4 text-[#071653]">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[180px] w-full items-center justify-center text-[#071653]">{content}</div>;
}

export default Loading;
