"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail, Send } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas/auth.schema";
import { forgotPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);

    try {
      await forgotPassword(values.email);
      window.location.assign("https://resend.com/emails");
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

      {/* Email field */}
      <div className="login-field space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#fffdf2]">
          Email akun
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
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-transparent text-sm text-[#fffdf2] outline-none placeholder:text-[#9699c5]"
            {...register("email")}
          />
        </div>
        {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
        <p className="text-[0.68rem] leading-5 text-[#9fa3d6]">
          Kami akan mengirim link reset yang aman ke email terdaftarmu.
        </p>
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
          <Send className="h-4 w-4" />
        )}
        Kirim link reset
      </button>

      <p className="text-center text-sm text-[#b8b8d6]">
        Ingat passwordmu?{" "}
        <Link href="/login" className="font-semibold text-[#6264b5] transition hover:text-[#8587d8]">
          Kembali ke login
        </Link>
      </p>
    </form>
  );
}
