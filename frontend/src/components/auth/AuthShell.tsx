import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Music2 } from "lucide-react";

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
  sideTitle?: string;
  sideDescription?: string;
  sideFeatures?: AuthFeature[];
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
  heroImage = "/login.png",
  heroImageAlt = "Tixora live experience",
}: AuthShellProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#071653] text-[#fffdf2]">
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="login-background-image object-cover object-center opacity-[0.84]"
      />

      <div aria-hidden className="login-background-overlay absolute inset-0 bg-gradient-to-br from-[#071653]/60 via-[#071653]/25 to-[#071653]/65" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#071653]/65 via-transparent to-[#071653]/25" />
      <div aria-hidden className="auth-shell-glow absolute inset-0" />
      <div aria-hidden className="login-ambient-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="login-background-beam pointer-events-none absolute -left-1/4 top-0 h-[130%] w-[45%] -rotate-[14deg] bg-gradient-to-r from-transparent via-[#c8b7db]/20 to-transparent blur-2xl" />
      <div aria-hidden className="auth-glow-drift pointer-events-none absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#6264b5]/30 blur-[120px]" />
      <div aria-hidden className="auth-glow-drift-reverse pointer-events-none absolute -right-36 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#c8b7db]/25 blur-[120px]" />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" aria-label="Tixora">
          <Image
            src="/tixora1.png"
            alt="Tixora"
            width={120}
            height={60}
            className="h-[32px] w-auto object-contain"
            priority
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071653]/40 px-3.5 py-2 text-xs font-semibold text-white/85 backdrop-blur-md transition-all hover:border-[#c8b7db]/60 hover:text-[#e3dcff]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-20 sm:px-8">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Music2 className="h-3.5 w-3.5 text-[#c8b7db]" />
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#e3dcff]">
                {eyebrow}
              </p>
            </div>
            <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.2rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {description}
            </p>
          </div>

          <div className="login-form-card relative overflow-hidden rounded-3xl border border-[#c8b7db]/25 bg-[#071653]/70 p-6 text-white shadow-[0_30px_90px_-28px_rgba(7,22,83,0.8)] backdrop-blur-2xl sm:p-8">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8b7db] to-transparent" />
            <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6264b5]/25 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-20 h-40 w-56 rounded-full bg-[#6264b5]/15 blur-3xl" />
            <div className="relative z-10">{children}</div>
          </div>

          {footer ? <div className="mt-6">{footer}</div> : null}

          <p className="mt-6 text-center text-[0.65rem] text-white/50">
            © 2025 Tixora · Curated live experiences
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthShell;
