"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";
import { forgotPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      setSuccessMessage("Jika email terdaftar, link reset password sudah kami kirim. Silakan cek inbox atau spam kamu.");
      reset();
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Terjadi kesalahan. Silakan coba lagi."));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Email akun</Label>
        <Input
          id="email"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-rose-300">{errors.email.message}</p>}
        <p className="text-xs leading-5 text-[#6683a3]/35">Kami akan mengirim link reset yang aman ke email terdaftarmu.</p>
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isSubmitting}>
        {!isSubmitting && <Send className="h-4 w-4" />}
        Kirim link reset
      </Button>

      <p className="text-center text-sm text-[#6683a3]/45">
        Ingat passwordmu?{" "}
        <Link href="/login" className="font-semibold text-[#2563eb] transition hover:text-[#60a5fa]">
          Kembali ke login
        </Link>
      </p>
    </form>
  );
}
