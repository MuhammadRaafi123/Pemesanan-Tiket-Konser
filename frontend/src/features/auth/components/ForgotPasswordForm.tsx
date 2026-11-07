"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas/auth.schema";
import { forgotPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword(values.email);
      setSuccessMessage(
        "Jika email terdaftar, link reset password sudah kami kirim. Silakan cek inbox atau spam kamu.",
      );
      reset();
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Terjadi kesalahan. Silakan coba lagi."));
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

      {successMessage ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#e1e2ec]">
          Email akun
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
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
            {...register("email")}
          />
        </div>
        {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
        <p className="text-[0.68rem] leading-5 text-[#4a4d58]">
          Kami akan mengirim link reset yang aman ke email terdaftarmu.
        </p>
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
          <Send className="h-4 w-4" />
        )}
        Kirim link reset
      </button>

      <p className="text-center text-sm text-[#6b6e7a]">
        Ingat passwordmu?{" "}
        <Link href="/login" className="font-semibold text-[#ffb703] transition hover:text-[#ffdea9]">
          Kembali ke login
        </Link>
      </p>
    </form>
  );
}
