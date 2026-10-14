import Link from "next/link";
import { LucideIcon, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: "light" | "dark";
}

export function EmptyState({
  icon: Icon = Ticket,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  variant = "light",
}: EmptyStateProps) {
  const isDark = variant === "dark";

  return (
    <Reveal variant="soft">
      <div
        className={`flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed px-8 py-14 text-center ${
          isDark
            ? "border-[#2a2d36] bg-[#191b23]"
            : "border-primary/20 bg-white/70"
        }`}
      >
        <span
          className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${
            isDark
              ? "border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]"
              : "border-primary/15 bg-accent text-primary"
          }`}
        >
          <span
            className={`absolute inset-0 rounded-2xl ${isDark ? "bg-[#ffb703]/10" : "bg-primary/10"}`}
            style={{ animation: "ripple 3.4s ease-out infinite" }}
          />
          <Icon className="relative h-7 w-7" />
        </span>

        <h3 className={`font-display text-2xl ${isDark ? "text-[#e1e2ec]" : "text-ink"}`}>{title}</h3>
        <p className={`mt-3 max-w-sm text-sm leading-7 ${isDark ? "text-[#8a8d98]" : "text-muted-foreground"}`}>
          {description}
        </p>

        {actionLabel && (actionHref || onAction) ? (
          <div className="mt-8">
            {actionHref ? (
              <Link href={actionHref}>
                <Button variant="default" size="default">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button variant="default" size="default" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export default EmptyState;
