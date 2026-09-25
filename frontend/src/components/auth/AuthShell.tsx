import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { cn } from "@/lib/utils";

interface AuthFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  sideTitle: string;
  sideDescription: string;
  sideFeatures: AuthFeature[];
  heroImage?: string;
  heroImageAlt?: string;
  heroLabel?: string;
  fullBackground?: boolean;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  sideTitle,
  sideDescription,
  sideFeatures,
  heroImage,
  heroImageAlt = "Concertix live experience",
  heroLabel = "Your next moment starts here",
  fullBackground = false,
}: AuthShellProps) {
  const hasHeroImage = Boolean(heroImage);
  const hasFullBackground = Boolean(fullBackground && heroImage);

  return (
    <main className="auth-shell relative h-[100dvh] min-h-0 overflow-hidden bg-[#f4f8ff] text-[#102a43]">
      {hasFullBackground && heroImage ? (
        <>
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="login-background-image object-cover object-center"
          />
          <div className="login-background-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(4,15,35,.2)_0%,rgba(4,15,35,.4)_48%,rgba(4,15,35,.72)_100%)]" />
        </>
      ) : null}
      {hasFullBackground ? null : <div className="pointer-events-none absolute inset-0 auth-shell-glow" />}

      <div
        className={cn(
          "relative z-10 mx-auto grid h-[100dvh] min-h-0 w-full",
          hasFullBackground
            ? "max-w-[1240px] gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(320px,0.78fr)_minmax(420px,0.9fr)] lg:gap-8 lg:px-8"
            : "max-w-[1500px] lg:grid-cols-[minmax(390px,0.9fr)_minmax(520px,1.1fr)]",
        )}
      >
        <aside
          className={cn(
            "relative hidden h-full min-h-0 overflow-hidden lg:flex lg:flex-col",
            hasFullBackground
              ? "border-0 bg-transparent p-4 sm:p-6 lg:p-8"
              : hasHeroImage
                ? "border-r border-white/10 bg-[#07152d]"
                : "border-r border-blue-100 bg-white/55",
          )}
        >
          {heroImage && !hasFullBackground ? (
            <>
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 45vw"
                className="login-hero-image object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,15,35,.18)_0%,rgba(4,15,35,.42)_42%,rgba(4,15,35,.92)_100%)]" />
              <div className="absolute inset-0 bg-blue-950/20" />
              <div className="login-hero-overlay absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(96,165,250,.22),transparent_30%),radial-gradient(circle_at_80%_72%,rgba(37,99,235,.2),transparent_38%)]" />
              <div className="login-hero-beam absolute -left-24 top-[-18%] h-[135%] w-28 rotate-[14deg] bg-blue-200/10 blur-3xl" />
              <div className="login-hero-beam absolute -right-28 top-[-10%] h-[125%] w-24 rotate-[14deg] bg-blue-400/10 blur-3xl [animation-delay:-3s]" />
            </>
          ) : null}

          <div
            className={cn(
              "relative z-10 flex h-full min-h-0 flex-col",
              hasFullBackground
                ? "rounded-[28px] border border-white/20 bg-[#07152d]/25 px-7 py-7 shadow-[0_20px_60px_-35px_rgba(2,8,23,.7)] backdrop-blur-md xl:px-9"
                : "px-8 py-5 xl:px-12",
              hasHeroImage && "text-white",
            )}
          >
            <BrandMark light={!hasHeroImage} />

            <div className="my-auto max-w-xl py-3 xl:py-4">
              <div
                className={cn(
                  "login-reveal login-reveal-delay-1 mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em]",
                  hasHeroImage
                    ? "border-white/20 bg-white/10 text-blue-100 backdrop-blur-md"
                    : "border-blue-200 bg-blue-50 text-[#2563eb]",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {hasHeroImage ? <span className="login-live-dot h-1.5 w-1.5 rounded-full bg-blue-200" /> : null}
                {hasHeroImage ? heroLabel : "The art of live"}
              </div>

              <h2
                className={cn(
                  "login-reveal login-reveal-delay-2 max-w-lg font-display text-4xl leading-[1.08] tracking-[-0.04em] xl:text-5xl",
                  hasHeroImage ? "text-white" : "text-[#123b6d]",
                )}
              >
                {sideTitle}
              </h2>
              <p
                className={cn(
                  "login-reveal login-reveal-delay-3 mt-4 max-w-md text-xs leading-6 xl:text-sm",
                  hasHeroImage ? "text-white/75" : "text-[#6683a3]",
                )}
              >
                {sideDescription}
              </p>

              <div className="mt-7 grid gap-2">
                {(hasFullBackground ? sideFeatures.slice(0, 2) : sideFeatures).map(({ icon: Icon, title: featureTitle, description: featureDescription }) => (
                  <div
                    key={featureTitle}
                    className={cn(
                      "login-feature group flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition",
                      hasHeroImage
                        ? "border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-white/35 hover:bg-white/15"
                        : "border-blue-100 bg-white/75 hover:border-blue-300 hover:bg-blue-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        hasHeroImage
                          ? "border-white/20 bg-white/10 text-blue-100"
                          : "border-blue-200 bg-blue-50 text-[#2563eb]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-xs font-medium xl:text-sm",
                          hasHeroImage ? "text-white" : "text-[#17457f]",
                        )}
                      >
                        {featureTitle}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[11px] leading-4",
                          hasHeroImage ? "text-white/65" : "text-[#8aa4c1]",
                        )}
                      >
                        {featureDescription}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 transition",
                        hasHeroImage
                          ? "text-white/0 group-hover:text-blue-200"
                          : "text-[#2563eb]/0 group-hover:text-[#2563eb]",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "login-reveal login-reveal-delay-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]",
                hasHeroImage ? "text-white/60" : "text-[#8aa4c1]",
              )}
            >
              <span>Curated live experiences</span>
              <span>© 2026 Concertix</span>
            </div>
          </div>
        </aside>

        <section
          className={cn(
            "relative flex h-full min-h-0 items-center justify-center overflow-y-auto",
            hasFullBackground
              ? "px-4 py-5 sm:px-6 lg:px-8"
              : "px-4 py-4 sm:px-8 sm:py-5 lg:px-12",
          )}
        >
          <div className="absolute left-5 top-6 sm:left-10 sm:top-8 lg:hidden">
            <BrandMark light={!hasFullBackground} />
          </div>
          <Link
            href="/"
            className={cn(
              "absolute right-5 top-7 inline-flex items-center gap-2 text-xs transition sm:right-10 lg:right-16",
              hasFullBackground
                ? "text-white/75 hover:text-white"
                : "text-[#6683a3] hover:text-[#2563eb]",
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Link>

          <div className="w-full max-w-[460px] max-h-full pt-12 sm:pt-14 lg:pt-0">
            {heroImage && !hasFullBackground ? (
              <div className="relative mb-4 h-24 overflow-hidden rounded-[24px] border border-blue-100 shadow-[0_24px_60px_-35px_rgba(37,99,235,.45)] sm:mb-5 sm:h-36 lg:hidden">
                <Image
                  src={heroImage}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="login-hero-image object-cover object-center"
                />
                <div className="login-hero-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(4,15,35,.08),rgba(4,15,35,.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="login-reveal login-reveal-delay-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-100">
                    {heroLabel}
                  </p>
                  <p className="login-reveal login-reveal-delay-3 mt-1 font-display text-2xl text-white">See you inside.</p>
                </div>
              </div>
            ) : null}

            <div className="login-reveal login-reveal-delay-1 mb-4 sm:mb-5">
              <p className={cn("mb-3 text-[10px] font-semibold uppercase tracking-[0.26em]", hasFullBackground ? "text-blue-100" : "text-[#2563eb]")}>
                {eyebrow}
              </p>
              <h1 className={cn("font-display text-3xl tracking-[-0.035em] sm:text-4xl", hasFullBackground ? "text-white drop-shadow-[0_2px_14px_rgba(2,8,23,.45)]" : "text-[#123b6d]")}>
                {title}
              </h1>
              <p className={cn("mt-3 max-w-md text-xs leading-6 sm:text-sm", hasFullBackground ? "text-white/75" : "text-[#6683a3]")}>{description}</p>
            </div>

            <div
              className={cn(
                "login-form-card relative overflow-hidden rounded-[28px] border p-4 shadow-[0_30px_80px_-45px_rgba(37,99,235,.4)] sm:p-6",
                hasFullBackground
                  ? "border-white/70 bg-white/90 backdrop-blur-2xl"
                  : "border-blue-100 bg-white",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#2563eb]" />
              {children}
            </div>

            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </section>
      </div>

    </main>
  );
}
