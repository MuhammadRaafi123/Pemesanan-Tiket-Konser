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
      <div className="login-field login-field-1 space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#fffdf2]">
          Email
        </label>
        <div className={`flex items-center gap-3 rounded-2xl border bg-white/[0.05] px-4 py-3.5 transition-all duration-300 focus-within:ring-2 ${
          errors.email
            ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
            : "border-white/15 focus-within:border-[#aaaaff]/70 focus-within:ring-[#6264b5]/20"
        }`}>
          <Mail className="h-4 w-4 shrink-0 text-[#9fa3d6]" />
          <input
            id="email"
            type="email"
            placeholder="you@gmail.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-transparent text-sm text-[#fffdf2] outline-none placeholder:text-[#9699c5]"
            {...register("email")}
          />
        </div>
        {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
      </div>

      {/* Password field */}
      <div className="login-field login-field-2 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="block text-sm font-semibold text-[#fffdf2]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#6264b5] transition hover:text-[#8587d8]"
          >
            Lupa password?
          </Link>
        </div>
        <div className={`flex items-center gap-3 rounded-2xl border bg-white/[0.05] px-4 py-3.5 transition-all duration-300 focus-within:ring-2 ${
          errors.password
            ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
            : "border-white/15 focus-within:border-[#aaaaff]/70 focus-within:ring-[#6264b5]/20"
        }`}>
          <LockKeyhole className="h-4 w-4 shrink-0 text-[#9fa3d6]" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className="w-full bg-transparent text-sm text-[#fffdf2] outline-none placeholder:text-[#9699c5]"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            onClick={() => setShowPassword((current) => !current)}
            className="rounded-full p-1 text-[#9fa3d6] transition hover:text-[#6264b5]"
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
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#6264b5] via-[#7779c9] to-[#6264b5] px-6 text-sm font-bold text-[#fffdf2] shadow-lg shadow-[#6264b5]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6264b5]/40 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]"
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
        <div className="h-px flex-1 bg-[#283567]" />
        <span className="text-xs text-[#9fa3d6]">atau</span>
        <div className="h-px flex-1 bg-[#283567]" />
      </div>

      <p className="text-center text-sm text-[#b8b8d6]">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-[#6264b5] transition hover:text-[#8587d8]">
          Buat akun gratis
        </Link>
      </p>
    </form>
  );
}
