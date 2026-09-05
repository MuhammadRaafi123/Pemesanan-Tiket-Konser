import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-[#141422] px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
