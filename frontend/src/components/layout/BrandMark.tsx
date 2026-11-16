import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
  light?: boolean;
  className?: string;
}

export function BrandMark({ href = "/", compact = false, className }: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]", className)}
      aria-label="Tixora"
    >
      <Image
        src="/tixora1.png"
        alt="Tixora"
        width={compact ? 120 : 160}
        height={compact ? 40 : 54}
        className={cn(
          "h-auto w-auto object-contain transition-all duration-300 group-hover:brightness-110",
          compact ? "h-[30px] max-w-[110px]" : "h-[40px] max-w-[150px]",
        )}
        priority
      />
    </Link>
  );
}

export default BrandMark;
