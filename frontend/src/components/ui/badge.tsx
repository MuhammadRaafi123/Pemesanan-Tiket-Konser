import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex select-none items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold leading-none transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "border-primary/15 bg-accent text-primary",
        secondary: "border-border bg-white text-ink-soft",
        outline: "border-primary/20 bg-transparent text-primary",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        destructive: "border-rose-200 bg-rose-50 text-rose-700",
        info: "border-primary/15 bg-accent/70 text-primary",
        gold: "border-gold/30 bg-[#fdf9f1] text-[#7a5a1f]",
        ghost: "border-transparent bg-transparent text-muted-foreground",
        gradient: "border-primary bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
