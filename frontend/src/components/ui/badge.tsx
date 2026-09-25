import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border select-none",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-50 text-[#1d4ed8]",
        secondary:
          "border-blue-100 bg-white text-[#17457f] backdrop-blur-md",
        outline:
          "border-blue-200 bg-white text-[#17457f]",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        info:
          "border-sky-200 bg-sky-50 text-sky-700",
        gradient:
          "border-transparent bg-[#2563eb] text-white shadow-[0_8px_22px_-12px_rgba(37,99,235,.55)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
