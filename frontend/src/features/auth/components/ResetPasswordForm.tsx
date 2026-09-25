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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  if (!token) {
    return (
      <div className="py-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] text-2xl text-rose-200"><KeyRound className="h-7 w-7" /></div>
        <h2 className="mt-5 font-display text-2xl text-[#123b6d]">Link tidak valid</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6683a3]/40">Token reset password tidak ditemukan atau sudah tidak berlaku.</p>
        <Link href="/forgot-password" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-xs font-semibold text-[#ffffff] transition hover:bg-[#1d4ed8]">Minta link baru</Link>
      </div>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(token, values.newPassword);
      setSuccessMessage("Password berhasil diperbarui. Silakan masuk dengan password baru.");
      reset();
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Link reset password tidak valid atau sudah kadaluarsa."));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{serverError}</span></div>}
      {successMessage && <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>{successMessage}</span></div>}

      {!successMessage ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Password baru</Label>
            <Input id="newPassword" type={showPassword ? "text" : "password"} icon={<LockKeyhole className="h-4 w-4" />} rightIcon={<button type="button" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword((current) => !current)} className="rounded-lg p-1 text-[#6683a3]/35 transition hover:text-[#2563eb]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} placeholder="Minimal 8 karakter" autoComplete="new-password" aria-invalid={Boolean(errors.newPassword)} {...register("newPassword")} />
            {errors.newPassword && <p className="text-xs text-rose-300">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Konfirmasi password</Label>
            <Input id="confirmPassword" type={showPassword ? "text" : "password"} icon={<ShieldCheck className="h-4 w-4" />} placeholder="Ulangi password baru" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-rose-300">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isSubmitting}>{!isSubmitting && <KeyRound className="h-4 w-4" />}Simpan password baru</Button>
          <Link href="/login" className="block text-center text-xs text-[#6683a3]/40 transition hover:text-[#2563eb]">Kembali ke login</Link>
        </>
      ) : (
        <Link href="/login" className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2563eb] text-xs font-semibold text-[#ffffff] transition hover:bg-[#1d4ed8]">Masuk sekarang</Link>
      )}
    </form>
  );
}
