import React from "react";
import Link from "next/link";
import { LucideIcon, Search, Ticket, Sparkles } from "lucide-react";
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
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-xl">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-950/30 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        <Icon className="h-10 w-10" />
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-cyan-400" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/50 leading-relaxed">
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
