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
  heroImageAlt = "Tixora live experience",
}: AuthShellProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden text-[#e1e2ec]">
      {/* Full-screen background image */}
      <Image
        src="/konser web.jpg"
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div aria-hidden className="absolute inset-0 bg-black/60" />

      {/* Gradient overlay - darker at bottom */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" aria-label="Tixora">
          <Image
            src="/tixora.png"
            alt="Tixora"
            width={120}
            height={60}
            className="h-[32px] w-auto object-contain"
            priority
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition-all hover:border-[#ffb703]/50 hover:text-[#ffb703]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali
        </Link>
      </div>

      {/* Center form */}
      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-20 sm:px-8">
        <div className="w-full max-w-[440px]">
          {/* Heading */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Music2 className="h-3.5 w-3.5 text-[#ffb703]" />
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#ffb703]">
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

          {/* Form card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {/* Top accent line */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb703]/50 to-transparent" />
            {children}
          </div>

          {footer ? <div className="mt-6">{footer}</div> : null}

          <p className="mt-6 text-center text-[0.65rem] text-white/30">
            © 2025 Tixora · Curated live experiences
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthShell;
