import React from "react";
import Link from "next/link";
import { LucideIcon, Ticket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Ticket,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_-30px_rgba(37,99,235,.3)] backdrop-blur-xl">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-200 bg-blue-50 text-[#2563eb] shadow-[0_14px_30px_-18px_rgba(37,99,235,.35)]">
        <Icon className="h-10 w-10" />
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-sky-500" />
      </div>

      <h3 className="text-xl font-bold text-[#123b6d] tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#6683a3] leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="glow" size="default">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="glow" size="default" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
export default EmptyState;
