"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  label?: string;
}

export function Dialog({ open, onOpenChange, children, label = "Dialog" }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const ready = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(ready);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  // Portalled to <body> so scroll-positioned or transformed ancestors can never
  // capture the overlay.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={label}>
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-md"
        style={{ animation: "page-enter 240ms ease both" }}
        onClick={() => onOpenChange(false)}
      />
      <div className="login-form-card relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-border bg-white p-7 text-ink shadow-[0_40px_120px_-40px_rgba(13,38,84,.5)]">
        {children}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-primary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Tutup</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 flex flex-col gap-1.5", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-2xl text-ink", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}
