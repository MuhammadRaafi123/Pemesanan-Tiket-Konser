import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Check, Music2 } from "lucide-react";

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
  heroImageAlt = "Tixora live experience",
  heroLabel = "Your next moment starts here",
}: AuthShellProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#0b0e15] text-[#e1e2ec]">
      {/* Background ambient effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[600px] rounded-full bg-[#ffb703]/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#6801d1]/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[800px] rounded-full bg-[#ffb703]/[0.02] blur-[100px]" />
      </div>

      <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1440px] lg:grid-cols-[1.1fr_0.9fr]">
        {/* ─── Left: Editorial / Showcase Panel ─── */}
        <aside className="relative hidden flex-col justify-between overflow-hidden lg:flex">
          {/* Background image or gradient */}
          {heroImage ? (
            <>
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 55vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e15]/90 via-[#0b0e15]/60 to-[#0b0e15]/85" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f1219] via-[#131620] to-[#0b0e15]">
              {/* Abstract grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
            </div>
          )}

          {/* Decorative glow orbs */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-[#ffb703]/10 blur-[60px] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
            <div className="absolute bottom-20 right-16 h-24 w-24 rounded-full bg-[#d5baff]/10 blur-[50px] animate-[drift-b_22s_ease-in-out_infinite_alternate]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
            {/* Top: Brand */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2 group" aria-label="Tixora">
                <Image
                  src="/tixora.png"
                  alt="Tixora"
                  width={140}
                  height={70}
                  className="h-[36px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  priority
                />
              </Link>
            </div>

            {/* Center: Headline */}
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffb703] animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#ffb703]/80 font-medium">
                  {heroLabel}
                </span>
              </div>

              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl">
                {sideTitle}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#8a8d98]">
                {sideDescription}
              </p>

              {/* Feature cards */}
              <div className="mt-9 space-y-2.5">
                {sideFeatures.map(({ icon: Icon, title, description: desc }) => (
                  <div
                    key={title}
                    className="group flex items-center gap-4 rounded-2xl border border-[#1e2128] bg-[#141720]/80 px-4 py-3.5 backdrop-blur-md transition-all duration-500 hover:border-[#ffb703]/30 hover:bg-[#191b23]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#232733] bg-[#1d1f27] text-[#ffb703] transition-all duration-300 group-hover:border-[#ffb703]/40 group-hover:shadow-[0_0_16px_rgba(255,183,3,0.15)]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-[#e1e2ec] group-hover:text-white transition-colors">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#6b6e7a] group-hover:text-[#8a8d98] transition-colors">
                        {desc}
                      </span>
                    </span>
                    <Check className="ml-auto h-4 w-4 text-transparent transition-all duration-500 group-hover:text-[#ffb703]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Footer */}
            <p className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-[#4a4d58]">
              <span className="h-1 w-1 rounded-full bg-[#ffb703]/60" />
              Curated live experiences · © 2025 Tixora
            </p>
          </div>
        </aside>

        {/* ─── Right: Form Panel ─── */}
        <section className="relative flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
          {/* Subtle side border */}
          <div aria-hidden className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#232733] to-transparent" />

          {/* Mobile brand */}
          <div className="absolute left-5 top-6 sm:left-10 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Tixora">
              <Image
                src="/tixora.png"
                alt="Tixora"
                width={120}
                height={60}
                className="h-[32px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Back button */}
          <Link
            href="/"
            className="absolute right-5 top-6 inline-flex items-center gap-2 rounded-full border border-[#232733] bg-[#141720]/80 px-3.5 py-2 text-xs font-semibold text-[#8a8d98] backdrop-blur-md transition-all hover:border-[#ffb703]/30 hover:text-[#ffb703] sm:right-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Link>

          <div className="w-full max-w-[440px] pt-14 sm:pt-16">
            {/* Heading */}
            <div className="login-reveal login-reveal-delay-1">
              <div className="flex items-center gap-2 mb-3">
                <Music2 className="h-3.5 w-3.5 text-[#ffb703]" />
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#ffb703]">
                  {eyebrow}
                </p>
              </div>
              <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.35rem]">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#6b6e7a] max-w-sm">
                {description}
              </p>
            </div>

            {/* Form card */}
            <div className="login-form-card relative mt-8 overflow-hidden rounded-2xl border border-[#1e2128] bg-[#141720] p-6 shadow-[0_40px_100px_-46px_rgba(0,0,0,.6)] sm:p-8">
              {/* Top accent line */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb703]/40 to-transparent" />
              {children}
            </div>

            {footer ? <div className="mt-6">{footer}</div> : null}

            <p className="mt-8 text-center text-[0.68rem] text-[#4a4d58]">
              Dengan melanjutkan, kamu menyetujui pengalaman Tixora yang lebih personal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
