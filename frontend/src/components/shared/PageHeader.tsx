import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  className?: string;
}

/** Shared heading block so every inner page opens with the same rhythm. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  className,
}: PageHeaderProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 border-b border-border pb-8",
        align === "start" ? "sm:flex-row sm:items-end sm:justify-between" : "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className={cn("font-display-xl mt-4 text-[2rem] leading-[1.06] text-ink sm:text-[2.6rem]", align === "center" && "mx-auto")}>
          {title}
        </h1>
        {description ? (
          <p className={cn("prose-soft mt-4", align === "center" && "mx-auto")}>{description}</p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div> : null}
    </Reveal>
  );
}

export default PageHeader;
