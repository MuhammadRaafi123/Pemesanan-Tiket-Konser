import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps =
  React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm text-[#102a43] focus-visible:outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer",
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
