import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap overflow-hidden rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_rgba(27,69,199,.65)] hover:bg-[#16389f] hover:shadow-[0_16px_34px_-16px_rgba(27,69,199,.6)]",
        glow:
          "bg-primary text-primary-foreground shadow-[0_14px_34px_-16px_rgba(27,69,199,.75)] hover:bg-[#16389f] hover:shadow-[0_20px_44px_-18px_rgba(27,69,199,.7)]",
        secondary:
          "border border-border bg-white text-ink shadow-[0_1px_2px_rgba(10,27,51,.04)] hover:border-primary/25 hover:text-primary",
        outline:
          "border border-primary/20 bg-transparent text-ink hover:border-primary/45 hover:bg-accent/50 hover:text-primary",
        ghost: "text-muted-foreground hover:bg-accent/70 hover:text-ink",
        destructive:
          "bg-destructive text-white shadow-[0_10px_24px_-14px_rgba(178,58,50,.6)] hover:bg-[#9c2f28]",
        amber:
          "bg-[#b8791f] text-white shadow-[0_10px_24px_-14px_rgba(184,121,31,.6)] hover:bg-[#9c6115]",
        gold:
          "border border-gold/35 bg-[#fdf9f1] text-[#7a5a1f] hover:border-gold/60 hover:bg-[#faf3e4]",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-[0.8125rem]",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
