import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";

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
  /** When present the panel becomes a dark photographic surface. */
  heroImage?: string;
  heroImageAlt?: string;
  heroLabel?: string;
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
}: AuthShellProps) {
  const hasPhoto = Boolean(heroImage);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 auth-shell-glow" />
      <div aria-hidden className="pointer-events-none absolute inset-0 login-ambient-grid" />

      <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1400px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Editorial panel */}
        <aside
          className={`relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14 ${
            hasPhoto ? "" : "border-r border-border bg-white/55 backdrop-blur-sm"
          }`}
        >
          {heroImage ? (
            <>
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 55vw"
                className="login-clean-photo object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/85" />
              <div
                aria-hidden
                className="login-hero-beam absolute -left-32 top-[-20%] h-[140%] w-32 rotate-[14deg] bg-primary/25 blur-3xl"
              />
            </>
          ) : (
            <div aria-hidden className="pointer-events-none absolute inset-0 fine-grid opacity-70" />
          )}

          <div className="relative z-10">
            <BrandMark light={!hasPhoto} />
          </div>

          <div className="relative z-10 max-w-lg">
            <p className={`eyebrow ${hasPhoto ? "eyebrow-light" : ""}`}>
              <span
                className={`login-live-dot h-1.5 w-1.5 rounded-full ${
                  hasPhoto ? "bg-gold-soft" : "bg-primary"
                }`}
              />
              {heroLabel}
            </p>
            <h2
              className={`font-display-xl mt-6 text-4xl leading-[1.06] xl:text-5xl ${
                hasPhoto ? "text-white" : "text-ink"
              }`}
            >
              {sideTitle}
            </h2>
            <p className={`mt-5 max-w-md text-sm leading-7 ${hasPhoto ? "text-white/70" : "text-muted-foreground"}`}>
              {sideDescription}
            </p>

            <div className="mt-9 space-y-2">
              {sideFeatures.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 backdrop-blur-md transition-colors duration-500 ${
                    hasPhoto
                      ? "border-white/15 bg-white/[0.07] hover:border-white/30 hover:bg-white/[0.12]"
                      : "border-border bg-white/80 hover:border-primary/25 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      hasPhoto ? "border-white/15 text-white/80" : "border-primary/15 bg-accent text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className={`block text-sm font-semibold ${hasPhoto ? "text-white" : "text-ink"}`}>
                      {title}
                    </span>
                    <span className={`mt-0.5 block text-xs ${hasPhoto ? "text-white/60" : "text-muted-foreground"}`}>
                      {description}
                    </span>
                  </span>
                  <Check
                    className={`ml-auto h-4 w-4 text-transparent transition-all duration-500 group-hover:text-gold ${
                      hasPhoto ? "" : "group-hover:border-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <p
            className={`relative z-10 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] ${
              hasPhoto ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${hasPhoto ? "bg-gold-soft" : "bg-gold"}`} />
            Curated live experiences · © 2026 Concertix
          </p>
        </aside>

        {/* Form panel */}
        <section className="relative flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
          <div className="absolute left-5 top-6 sm:left-10 lg:hidden">
            <BrandMark />
          </div>
          <Link
            href="/"
            className="absolute right-5 top-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-md transition hover:border-primary/30 hover:text-primary sm:right-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Link>

          <div className="w-full max-w-[440px] pt-14 sm:pt-16">
            <div className="login-reveal login-reveal-delay-1">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="font-display-xl mt-4 text-[2rem] leading-tight text-ink sm:text-[2.35rem]">
                {title}
              </h1>
              <p className="prose-soft mt-4 max-w-sm">{description}</p>
            </div>

            <div className="login-form-card relative mt-8 overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-[0_40px_100px_-46px_rgba(13,38,84,.5)] sm:p-8">
              <div aria-hidden className="absolute inset-x-0 top-0 h-px hairline-gold" />
              {children}
            </div>

            {footer ? <div className="mt-6">{footer}</div> : null}

            <p className="mt-8 text-center text-[0.68rem] text-muted-foreground">
              Dengan melanjutkan, kamu menyetujui pengalaman Concertix yang lebih personal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
