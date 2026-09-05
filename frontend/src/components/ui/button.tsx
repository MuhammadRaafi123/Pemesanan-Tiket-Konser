import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-purple-600 text-white shadow-lg shadow-purple-600/25 hover:bg-purple-500 hover:shadow-purple-600/40 hover:scale-[1.02]",
        glow:
          "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-[1.03]",
        secondary:
          "bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02]",
        outline:
          "border border-white/15 bg-transparent text-white hover:bg-white/5 hover:border-purple-400/50 hover:text-purple-300",
        ghost:
          "text-white/70 hover:bg-white/10 hover:text-white",
        destructive:
          "bg-rose-600/90 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500",
        amber:
          "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-7 text-base",
        icon: "h-10 w-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };