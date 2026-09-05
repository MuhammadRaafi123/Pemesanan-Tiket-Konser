import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white/[0.06] border border-white/5",
        className
      )}
      {...props}
    />
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
