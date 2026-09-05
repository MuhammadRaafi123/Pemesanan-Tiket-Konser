import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT - BRANDING */}
        <section className="hidden lg:flex bg-[#0e0e12] border-r border-white/5">
          <div className="flex w-full flex-col justify-between p-12">

            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <span className="text-lg font-black">C</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Concertix</span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                🎵 Live the moment
              </div>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Jangan lewatkan
                <span className="block text-violet-400">konser favoritmu.</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
                Temukan event musik terbaik, pesan tiket dengan mudah,
                dan nikmati pengalaman konser tanpa ribet.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">🎟️</div>
                  <div>
                    <p className="text-sm font-semibold">Tiket Digital</p>
                    <p className="text-xs text-white/40">Simpan tiket langsung di akunmu.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">⚡</div>
                  <div>
                    <p className="text-sm font-semibold">Pembelian Cepat</p>
                    <p className="text-xs text-white/40">Checkout mudah dan praktis.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">🔐</div>
                  <div>
                    <p className="text-sm font-semibold">Aman dan Terpercaya</p>
                    <p className="text-xs text-white/40">Data akunmu tetap terlindungi.</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/25">© 2026 Concertix. All rights reserved.</p>
          </div>
        </section>

        {/* RIGHT - FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">

            <Link href="/" className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <span className="text-lg font-black">C</span>
              </div>
              <span className="text-xl font-bold">Concertix</span>
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Welcome back</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Masuk ke akun</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Masuk untuk melanjutkan perjalanan musikmu.
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8">
              <LoginForm />
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
