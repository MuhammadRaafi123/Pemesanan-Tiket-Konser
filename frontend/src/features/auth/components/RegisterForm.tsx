"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  ArrowLeft,
  Shield,
  Zap,
  Ticket,
  Music2,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";
import { registerUser } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";

/* ─────────────────────────────────────────────
   Floating Particles (ambient futuristic vibe)
   ───────────────────────────────────────────── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 8,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#c9a85e]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `register-particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Password Strength Indicator
   ───────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const getStrength = useCallback((pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }, []);

  const strength = getStrength(password);
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const colors = [
    "bg-white/10",
    "bg-red-500",
    "bg-amber-500",
    "bg-emerald-400",
    "bg-[#c9a85e]",
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= strength ? colors[strength] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-[0.65rem] font-medium transition-colors duration-300 ${
          strength <= 1
            ? "text-red-400"
            : strength === 2
              ? "text-amber-400"
              : strength === 3
                ? "text-emerald-400"
                : "text-[#c9a85e]"
        }`}
      >
        {labels[strength]}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature Card (left panel)
   ───────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: typeof Music2;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-500 hover:border-[#c9a85e]/20 hover:bg-white/[0.06]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a85e]/20 to-[#c9a85e]/5 transition-all duration-500 group-hover:from-[#c9a85e]/30 group-hover:to-[#c9a85e]/10 group-hover:shadow-lg group-hover:shadow-[#c9a85e]/10">
        <Icon className="h-[18px] w-[18px] text-[#c9a85e]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-white/40">{desc}</p>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MAIN REGISTER FORM COMPONENT
   ═════════════════════════════════════════════ */
export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: undefined, password: "" },
  });

  const watchPassword = watch("password");

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      });

      setSuccessMessage(
        "Akun berhasil dibuat. Sekarang masuk untuk menemukan momen live berikutnya."
      );
      reset();
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(error, "Registrasi gagal. Silakan coba lagi.")
      );
    }
  };

  /* Reusable futuristic input wrapper */
  const inputWrap = (fieldName: string, hasError: boolean) =>
    `group/input relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
      hasError
        ? "border-red-500/30 bg-red-500/[0.04] shadow-[0_0_20px_rgba(239,68,68,0.06)]"
        : focusedField === fieldName
          ? "border-[#c9a85e]/40 bg-[#c9a85e]/[0.04] shadow-[0_0_30px_rgba(201,168,94,0.08)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
    }`;

  const iconCls = (fieldName: string, hasError: boolean) =>
    `h-[18px] w-[18px] shrink-0 transition-all duration-300 ${
      hasError
        ? "text-red-400"
        : focusedField === fieldName
          ? "text-[#c9a85e]"
          : "text-white/25"
    }`;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#08080a] text-white">
      {/* ── Ambient Background Layers ────────────────────── */}
      <div className="absolute inset-0">
        {/* Background image with parallax feel */}
        <Image
          src="/konser web.jpg"
          alt="Concert atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 register-bg-drift"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#08080a]/95 via-[#08080a]/80 to-[#08080a]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/60" />

        {/* Futuristic accent glows */}
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#c9a85e]/[0.06] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#c9a85e]/[0.04] blur-[100px]" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-[#c9a85e]/[0.03] blur-[100px]" />

        {/* Animated particles */}
        <FloatingParticles />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,94,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Top Navigation Bar ───────────────────────────── */}
      <nav
        className={`absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <Link href="/" aria-label="Tixora">
          <Image
            src="/tixora1.png"
            alt="Tixora"
            width={120}
            height={60}
            className="h-[28px] w-auto object-contain transition-opacity hover:opacity-80 sm:h-[32px]"
            priority
          />
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-[#c9a85e]/30 hover:bg-[#c9a85e]/[0.06] hover:text-[#c9a85e]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Kembali
        </Link>
      </nav>

      {/* ── Main Content: Two-Column Layout ──────────────── */}
      <div className="relative z-10 flex min-h-[100dvh]">
        {/* ─── Left Panel: Brand / Features (hidden on mobile) ── */}
        <div className="hidden w-[48%] flex-col justify-center px-12 py-20 lg:flex xl:w-[45%] xl:px-20">
          <div
            className={`max-w-md transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#c9a85e]/20 bg-[#c9a85e]/[0.06] px-4 py-1.5">
              <Music2 className="h-3.5 w-3.5 text-[#c9a85e]" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]">
                Mulai Perjalananmu
              </span>
            </div>

            {/* Hero copy */}
            <h1 className="text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-white xl:text-[3.25rem]">
              Satu Akun,
              <br />
              <span className="bg-gradient-to-r from-[#c9a85e] via-[#e8d5a3] to-[#c9a85e] bg-clip-text text-transparent">
                Ribuan Momen.
              </span>
            </h1>

            <p className="mt-5 text-[0.95rem] leading-relaxed text-white/45 max-w-[380px]">
              Bergabunglah dengan komunitas pecinta musik. Akses eksklusif ke
              konser terbaik, tiket digital yang aman, dan pengalaman yang tak
              terlupakan.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-3">
              <FeatureCard
                icon={Ticket}
                title="Tiket Digital Aman"
                desc="QR code unik untuk setiap tiket, anti-duplikasi"
                delay={400}
              />
              <FeatureCard
                icon={Zap}
                title="Booking Instan"
                desc="Proses pemesanan cepat tanpa antri panjang"
                delay={550}
              />
              <FeatureCard
                icon={Shield}
                title="Transaksi Terlindungi"
                desc="Pembayaran aman dengan proteksi penuh"
                delay={700}
              />
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  "bg-gradient-to-br from-amber-400 to-orange-500",
                  "bg-gradient-to-br from-violet-400 to-purple-500",
                  "bg-gradient-to-br from-cyan-400 to-blue-500",
                  "bg-gradient-to-br from-emerald-400 to-green-500",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full ${bg} border-2 border-[#08080a] flex items-center justify-center text-[0.6rem] font-bold text-white`}
                  >
                    {["R", "A", "D", "S"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">10.000+</p>
                <p className="text-xs text-white/35">pengguna bergabung</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Panel: Registration Form ────────────────── */}
        <div className="flex flex-1 items-center justify-center px-5 py-24 sm:px-8 lg:pr-12 xl:pr-20">
          <div
            className={`w-full max-w-[460px] transition-all duration-1000 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Mobile-only heading */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c9a85e]/20 bg-[#c9a85e]/[0.06] px-3.5 py-1.5">
                <Music2 className="h-3 w-3 text-[#c9a85e]" />
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#c9a85e]">
                  Buat Akunmu
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Mulai dari satu{" "}
                <span className="bg-gradient-to-r from-[#c9a85e] to-[#e8d5a3] bg-clip-text text-transparent">
                  momen.
                </span>
              </h1>
              <p className="mt-2 text-sm text-white/40">
                Buat akun gratis dan temukan konser terbaik untukmu.
              </p>
            </div>

            {/* ── Glass Form Card ──────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-2xl">
              {/* Top accent beam */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a85e]/50 to-transparent" />

              {/* Subtle corner glow */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#c9a85e]/[0.06] blur-[60px]" />

              <div className="relative p-7 sm:p-9">
                {/* Desktop card header */}
                <div className="mb-7 hidden lg:block">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Buat Akun Baru
                  </h2>
                  <p className="mt-1.5 text-sm text-white/40">
                    Isi data di bawah untuk memulai perjalanan musikmu
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Server error */}
                  {serverError && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3.5 text-sm leading-6 text-red-400 backdrop-blur-sm"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                        <AlertCircle className="h-3 w-3" />
                      </div>
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Success */}
                  {successMessage && (
                    <div
                      role="status"
                      className="flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-3.5 text-sm leading-6 text-emerald-400 backdrop-blur-sm"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* ── Form Fields ──────────────────────── */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-[0.8rem] font-semibold text-white/70"
                      >
                        Nama Lengkap
                      </label>
                      <div className={inputWrap("name", Boolean(errors.name))}>
                        <UserRound
                          className={iconCls("name", Boolean(errors.name))}
                        />
                        <input
                          id="name"
                          placeholder="Masukkan nama lengkap"
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                          {...register("name")}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {errors.name && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-[0.8rem] font-semibold text-white/70"
                      >
                        Email
                      </label>
                      <div
                        className={inputWrap("email", Boolean(errors.email))}
                      >
                        <Mail
                          className={iconCls("email", Boolean(errors.email))}
                        />
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                          {...register("email")}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {errors.email && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-[0.8rem] font-semibold text-white/70"
                      >
                        No. Telepon{" "}
                        <span className="font-normal text-white/25">
                          (opsional)
                        </span>
                      </label>
                      <div
                        className={inputWrap("phone", Boolean(errors.phone))}
                      >
                        <Phone
                          className={iconCls("phone", Boolean(errors.phone))}
                        />
                        <input
                          id="phone"
                          type="tel"
                          placeholder="0812 3456 7890"
                          autoComplete="tel"
                          aria-invalid={Boolean(errors.phone)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                          {...register("phone")}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {errors.phone && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="password"
                        className="block text-[0.8rem] font-semibold text-white/70"
                      >
                        Password
                      </label>
                      <div
                        className={inputWrap(
                          "password",
                          Boolean(errors.password)
                        )}
                      >
                        <LockKeyhole
                          className={iconCls(
                            "password",
                            Boolean(errors.password)
                          )}
                        />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          autoComplete="new-password"
                          aria-invalid={Boolean(errors.password)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                          {...register("password")}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                          onClick={() => setShowPassword((c) => !c)}
                          className="rounded-full p-1 text-white/25 transition-all duration-300 hover:text-[#c9a85e]"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password.message}
                        </p>
                      )}
                      <PasswordStrength password={watchPassword || ""} />
                    </div>
                  </div>

                  {/* ── Submit Button ────────────────────── */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#c9a85e] via-[#dfc786] to-[#c9a85e] px-6 text-sm font-bold text-[#10110d] shadow-lg shadow-[#c9a85e]/15 transition-all duration-500 hover:shadow-xl hover:shadow-[#c9a85e]/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {/* Sheen effect on hover */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex items-center gap-2.5">
                      {isSubmitting ? (
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="opacity-25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {isSubmitting ? "Membuat akun..." : "Buat Akun Saya"}
                    </span>
                  </button>

                  {/* ── Divider ──────────────────────────── */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <span className="text-[0.65rem] font-medium uppercase tracking-widest text-white/20">
                      atau
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* ── Login Link ───────────────────────── */}
                  <p className="text-center text-sm text-white/40">
                    Sudah punya akun?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#c9a85e] transition-all duration-300 hover:text-[#e8d5a3] hover:underline hover:underline-offset-4"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </form>
              </div>

              {/* Bottom accent beam */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a85e]/20 to-transparent" />
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            <p className="mt-8 text-center text-[0.6rem] tracking-wider text-white/15">
              © 2025 Tixora · Curated live experiences
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
