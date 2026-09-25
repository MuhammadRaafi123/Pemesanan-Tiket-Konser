import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] overflow-x-hidden bg-[#f7faff] px-4 py-6 text-[#102a43] sm:px-6 sm:py-8">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src="/login.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="login-clean-photo object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#f7faff]/45" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(247,250,255,.86)_0%,rgba(232,241,255,.62)_48%,rgba(255,255,255,.84)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[1120px] flex-col sm:min-h-[calc(100dvh-4rem)]">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-[#6683a3] transition hover:bg-white hover:text-[#2563eb]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <section className="w-full max-w-[440px] rounded-[24px] border border-blue-100 bg-white px-5 py-7 shadow-[0_24px_70px_-42px_rgba(37,99,235,.35)] sm:px-8 sm:py-9">
            <div className="mb-7 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2563eb]">
                Selamat datang kembali
              </p>
              <h1 className="mt-3 font-display text-3xl tracking-[-0.035em] text-[#123b6d] sm:text-4xl">
                Masuk ke akunmu
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6683a3]">
                Masuk untuk menemukan konser dan menyimpan tiket digitalmu.
              </p>
            </div>

            <LoginForm />
          </section>
        </div>

        <footer className="pb-1 text-center text-[11px] text-[#8aa4c1]">
          © 2026 Concertix
        </footer>
      </div>
    </main>
  );
}
