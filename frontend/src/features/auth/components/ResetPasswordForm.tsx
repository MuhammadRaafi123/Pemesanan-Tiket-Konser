"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";
import { resetPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";

interface ResetPasswordFormProps {
  token: string | null;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(token as string, values.newPassword);
      setSuccessMessage("Password berhasil diperbarui. Silakan masuk dengan password baru.");
      reset();
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(error, "Link reset password tidak valid atau sudah kadaluarsa."),
      );
    }
  };

  const inputWrap = (hasError: boolean) =>
    `flex items-center gap-3 rounded-2xl border bg-white/[0.05] px-4 py-3.5 transition-all duration-300 focus-within:ring-2 ${
      hasError
        ? "border-red-500/40 focus-within:border-red-500/60 focus-within:ring-red-500/10"
        : "border-white/15 focus-within:border-[#aaaaff]/70 focus-within:ring-[#6264b5]/20"
    }`;

  if (!token) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          <KeyRound className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold text-white">Link tidak valid</h2>
        <p className="mt-2 text-sm leading-6 text-[#b8b8d6]">
          Token reset password tidak ditemukan atau sudah tidak berlaku.
        </p>
        <Link
          href="/forgot-password"
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6264b5] via-[#7779c9] to-[#6264b5] px-6 text-sm font-bold text-[#fffdf2] shadow-lg shadow-[#6264b5]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6264b5]/40"
        >
          Minta link baru
        </Link>
      </div>
    );
  }

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

      {successMessage ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      {successMessage ? (
        <Link
          href="/login"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6264b5] via-[#7779c9] to-[#6264b5] px-6 text-sm font-bold text-[#fffdf2] shadow-lg shadow-[#6264b5]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6264b5]/40"
        >
          Masuk sekarang
        </Link>
      ) : (
        <>
          {/* New password */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-[#fffdf2]">
              Password baru
            </label>
            <div className={inputWrap(Boolean(errors.newPassword))}>
              <LockKeyhole className="h-4 w-4 shrink-0 text-[#9fa3d6]" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.newPassword)}
                className="w-full bg-transparent text-sm text-[#fffdf2] outline-none placeholder:text-[#9699c5]"
                {...register("newPassword")}
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
            {errors.newPassword ? (
              <p className="text-xs font-medium text-red-400">{errors.newPassword.message}</p>
            ) : null}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#fffdf2]">
              Konfirmasi password
            </label>
            <div className={inputWrap(Boolean(errors.confirmPassword))}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#9fa3d6]" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="w-full bg-transparent text-sm text-[#fffdf2] outline-none placeholder:text-[#9699c5]"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs font-medium text-red-400">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          {/* Submit */}
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
              <KeyRound className="h-4 w-4" />
            )}
            Simpan password baru
          </button>

          <Link
            href="/login"
            className="block text-center text-xs font-semibold text-[#6264b5] transition hover:text-[#8587d8]"
          >
            Kembali ke login
          </Link>
        </>
      )}
    </form>
  );
}
