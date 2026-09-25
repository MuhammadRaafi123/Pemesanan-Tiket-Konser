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
          <div className="absolute left-4 flex items-center pointer-events-none text-[#8aa4c1] transition-colors group-focus-within:text-[#2563eb]">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm text-[#102a43] shadow-inner placeholder:text-[#8aa4c1] focus-visible:outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-blue-200 aria-invalid:border-rose-300/50 aria-invalid:ring-2 aria-invalid:ring-rose-300/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
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