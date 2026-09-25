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
        "rounded-xl bg-blue-50 border border-blue-100",
        className
      )}
      {...props}
    />
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
