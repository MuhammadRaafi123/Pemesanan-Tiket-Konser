import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightIcon, ...props }, ref) => {
    return (
      <div className="group relative flex w-full items-center">
        {icon ? (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
            {icon}
          </div>
        ) : null}
        <input
          type={type}
          className={cn(
            "h-12 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm text-ink shadow-[0_1px_2px_rgba(10,27,51,.03)] transition-all duration-300 placeholder:text-muted-foreground/70 hover:border-primary/20 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-300 aria-invalid:ring-4 aria-invalid:ring-rose-500/10",
            icon ? "pl-10" : "",
            rightIcon ? "pr-11" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {rightIcon ? <div className="absolute right-3 flex items-center">{rightIcon}</div> : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
