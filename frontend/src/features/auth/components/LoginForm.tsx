"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import { loginUser } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/stores/authStore";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const result = await loginUser(values);
      setAuth(result.user, result.token);
      router.replace(result.user.role === "admin" ? "/admin" : "/home");
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(error, "Login gagal. Silakan periksa email dan password."),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#e1e2ec]">
          Email
        </label>
        <div className={`flex items-center gap-3 rounded-xl border bg-[#1d1f27] px-4 py-3 transition-all duration-200 focus-within:ring-2 ${
          errors.email
            ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
            : "border-[#232733] focus-within:border-[#ffb703]/50 focus-within:ring-[#ffb703]/10"
        }`}>
          <Mail className="h-4 w-4 shrink-0 text-[#4a4d58]" />
          <input
            id="email"
            type="email"
            placeholder="you@gmail.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
            {...register("email")}
          />
        </div>
        {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="block text-sm font-semibold text-[#e1e2ec]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
          >
            Lupa password?
          </Link>
        </div>
        <div className={`flex items-center gap-3 rounded-xl border bg-[#1d1f27] px-4 py-3 transition-all duration-200 focus-within:ring-2 ${
          errors.password
            ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
            : "border-[#232733] focus-within:border-[#ffb703]/50 focus-within:ring-[#ffb703]/10"
        }`}>
          <LockKeyhole className="h-4 w-4 shrink-0 text-[#4a4d58]" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            autoComplete="current-password"
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
      </div>

      {/* Submit button */}
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
          <LogIn className="h-4 w-4" />
        )}
        Masuk ke Tixora
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#232733]" />
        <span className="text-xs text-[#4a4d58]">atau</span>
        <div className="h-px flex-1 bg-[#232733]" />
      </div>

      <p className="text-center text-sm text-[#6b6e7a]">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-[#ffb703] transition hover:text-[#ffdea9]">
          Buat akun gratis
        </Link>
      </p>
    </form>
  );
}
