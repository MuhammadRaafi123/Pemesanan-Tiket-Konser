import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border select-none",
  {
    variants: {
      variant: {
        default:
          "border-purple-500/30 bg-purple-950/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
        secondary:
          "border-white/10 bg-white/5 text-white/80 backdrop-blur-md",
        outline:
          "border-white/20 text-white/90 bg-transparent",
        success:
          "border-emerald-500/30 bg-emerald-950/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        warning:
          "border-amber-500/30 bg-amber-950/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        destructive:
          "border-rose-500/30 bg-rose-950/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
        cyan:
          "border-cyan-500/30 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
        gradient:
          "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]",
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
