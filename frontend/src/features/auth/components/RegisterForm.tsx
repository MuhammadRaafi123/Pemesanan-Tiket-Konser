"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { registerUser } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: undefined, password: "" },
  });

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

      setSuccessMessage("Akun berhasil dibuat. Sekarang masuk untuk menemukan momen live berikutnya.");
      reset();
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Registrasi gagal. Silakan coba lagi."));
    }
  };

  /* Reusable dark input wrapper */
  const inputWrap = (hasError: boolean) =>
    `flex items-center gap-3 rounded-xl border bg-[#1d1f27] px-4 py-3 transition-all duration-200 focus-within:ring-2 ${
      hasError
        ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
        : "border-[#232733] focus-within:border-[#ffb703]/50 focus-within:ring-[#ffb703]/10"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Server error */}
      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      {/* Success */}
      {successMessage ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-semibold text-[#e1e2ec]">
            Nama lengkap
          </label>
          <div className={inputWrap(Boolean(errors.name))}>
            <UserRound className="h-4 w-4 shrink-0 text-[#4a4d58]" />
            <input
              id="name"
              placeholder="Nama kamu"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
              {...register("name")}
            />
          </div>
          {errors.name ? <p className="text-xs font-medium text-red-400">{errors.name.message}</p> : null}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[#e1e2ec]">
            Email
          </label>
          <div className={inputWrap(Boolean(errors.email))}>
            <Mail className="h-4 w-4 shrink-0 text-[#4a4d58]" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
              {...register("email")}
            />
          </div>
          {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-[#e1e2ec]">
            Nomor telepon <span className="font-normal text-[#4a4d58]">(opsional)</span>
          </label>
          <div className={inputWrap(Boolean(errors.phone))}>
            <Phone className="h-4 w-4 shrink-0 text-[#4a4d58]" />
            <input
              id="phone"
              type="tel"
              placeholder="0812 3456 7890"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
              {...register("phone")}
            />
          </div>
          {errors.phone ? <p className="text-xs font-medium text-red-400">{errors.phone.message}</p> : null}
        </div>

        {/* Password */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="password" className="block text-sm font-semibold text-[#e1e2ec]">
            Password
          </label>
          <div className={inputWrap(Boolean(errors.password))}>
            <LockKeyhole className="h-4 w-4 shrink-0 text-[#4a4d58]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              onClick={() => setShowPassword((current) => !current)}
              className="rounded-full p-1 text-[#4a4d58] transition hover:text-[#ffb703]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs font-medium text-red-400">{errors.password.message}</p> : null}
          <p className="text-[0.68rem] leading-5 text-[#4a4d58]">
            Gunakan password yang kuat dan unik untuk akunmu.
          </p>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#ffb703] px-6 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]"
      >
        {isSubmitting ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Buat akun saya
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#232733]" />
        <span className="text-xs text-[#4a4d58]">atau</span>
        <div className="h-px flex-1 bg-[#232733]" />
      </div>

      <p className="text-center text-sm text-[#6b6e7a]">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-[#ffb703] transition hover:text-[#ffdea9]">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
