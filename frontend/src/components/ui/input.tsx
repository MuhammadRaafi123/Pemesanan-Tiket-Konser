import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full group">
        {icon && (
          <div className="absolute left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white shadow-inner placeholder:text-white/35 focus-visible:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            icon ? "pl-11" : "",
            rightIcon ? "pr-11" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };