import { Disc3, Sparkles } from "lucide-react";

interface LoadingProps { message?: string; fullScreen?: boolean; }

export function Loading({ message = "Menyiapkan pengalaman konser...", fullScreen = false }: LoadingProps) {
  const content = <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite"><div className="relative mb-5 flex h-20 w-20 items-center justify-center"><div className="absolute inset-2 rounded-full border border-blue-200" /><div className="absolute inset-0 animate-ping rounded-full bg-blue-100" /><Disc3 className="h-10 w-10 animate-spin text-[#2563eb] [animation-duration:3s]" /><span className="absolute h-2 w-2 rounded-full bg-[#60a5fa]" /></div><p className="text-sm font-medium tracking-wide text-[#476b91]">{message}</p><div className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#8aa4c1]"><Sparkles className="h-3 w-3 text-[#2563eb]" />Concertix</div></div>;
  if (fullScreen) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4f8ff]/95 backdrop-blur-xl">{content}</div>;
  return <div className="flex min-h-[300px] w-full items-center justify-center">{content}</div>;
}

export default Loading;
