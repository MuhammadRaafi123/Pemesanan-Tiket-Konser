import Link from "next/link";
import { Disc3 } from "lucide-react";

interface BrandMarkProps { href?: string; compact?: boolean; light?: boolean; }

export function BrandMark({ href = "/", compact = false, light = true }: BrandMarkProps) {
  return <Link href={href} className="group inline-flex items-center gap-3" aria-label="Concertix"><span className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-600 text-white shadow-[0_10px_25px_-12px_rgba(37,99,235,.65)] transition group-hover:border-blue-400 group-hover:bg-blue-700"><Disc3 className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" /><span className="absolute h-1.5 w-1.5 rounded-full bg-blue-100" /></span>{!compact && <span className={`text-lg font-semibold tracking-[0.18em] ${light ? "text-[#17457f]" : "text-white"}`}>CONCERTIX</span>}</Link>;
}
