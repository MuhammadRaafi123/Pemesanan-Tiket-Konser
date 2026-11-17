import Image from "next/image";
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
      className="flex flex-col items-center justify-center rounded-3xl border border-[#e8e5ef] bg-[#fffdf2] px-8 py-9 text-center shadow-[0_20px_60px_-40px_rgba(7,22,83,0.28)]"
      role="status"
      aria-live="polite"
    >
      <Image
        src="/tixora1.png"
        alt="Tixora"
        width={150}
        height={72}
        priority
        className="mb-7 h-10 w-auto object-contain"
      />
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
      <div aria-hidden className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-[#f0edf5]">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#6264b5] to-[#c8b7db] motion-safe:animate-pulse" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fffdf2] px-4">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[300px] w-full items-center justify-center px-4">{content}</div>;
}

export default Loading;
