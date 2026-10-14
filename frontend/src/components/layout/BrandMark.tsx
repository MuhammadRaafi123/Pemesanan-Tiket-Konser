import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
  /** `true` renders the wordmark in ink, `false` in white (for dark panels). */
  light?: boolean;
  className?: string;
}

export function BrandMark({ href = "/", compact = false, light = true, className }: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center", className)}
      aria-label="Tixora"
    >
      <Image
        src="/tixora.png"
        alt="Tixora"
        width={compact ? 100 : 140}
        height={compact ? 50 : 70}
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]",
          compact ? "h-[28px] w-[56px]" : "h-[36px] w-[72px]",
        )}
        priority
      />
    </Link>
  );
}

export default BrandMark;
