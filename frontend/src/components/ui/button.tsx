import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563eb] text-white shadow-lg shadow-blue-200 hover:bg-[#1d4ed8] hover:shadow-blue-300 hover:scale-[1.02]",
        glow:
          "bg-[#2563eb] text-white shadow-lg shadow-blue-200 hover:bg-[#1d4ed8] hover:shadow-blue-300 hover:scale-[1.02]",
        secondary:
          "bg-blue-50 text-[#17457f] backdrop-blur-md border border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:scale-[1.02]",
        outline:
          "border border-blue-200 bg-white text-[#17457f] hover:bg-blue-50 hover:border-blue-400 hover:text-[#1d4ed8]",
        ghost:
          "text-[#6683a3] hover:bg-blue-50 hover:text-[#17457f]",
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
        {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };