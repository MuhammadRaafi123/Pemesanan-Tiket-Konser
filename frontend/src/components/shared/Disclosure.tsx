"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclosureProps {
  title: ReactNode;
  description: ReactNode;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  className?: string;
}

/** Accordion row with a height + opacity transition. */
export function Disclosure({
  title,
  description,
  icon: Icon,
  defaultOpen = false,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-500",
        open ? "border-primary/25 bg-accent/40" : "hover:border-primary/20",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        {Icon ? (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500",
              open ? "border-primary/25 bg-white text-primary" : "border-border bg-muted/60 text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}

        <span className="min-w-0 flex-1 text-sm font-semibold text-ink">{title}</span>

        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
            open
              ? "rotate-45 border-primary bg-primary text-white"
              : "border-border text-primary group-hover:border-primary/40",
          )}
        >
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>

      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-500",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden px-5 pb-5 text-xs leading-6 text-muted-foreground sm:pl-[4.25rem]">
          {description}
        </div>
      </div>
    </div>
  );
}

export default Disclosure;
