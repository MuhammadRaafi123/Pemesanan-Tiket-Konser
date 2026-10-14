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

  if (!token) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-500">
          <KeyRound className="h-7 w-7" />
        </span>
        <h2 className="font-display mt-6 text-2xl text-ink">Link tidak valid</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Token reset password tidak ditemukan atau sudah tidak berlaku.
        </p>
        <Link href="/forgot-password" className="mt-7 inline-block">
          <Button>Minta link baru</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      {successMessage ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      {successMessage ? (
        <Link href="/login" className="block">
          <Button size="lg" className="w-full">
            Masuk sekarang
          </Button>
        </Link>
      ) : (
        <>
          <div className="login-field login-field-1 space-y-2">
            <Label htmlFor="newPassword">Password baru</Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              icon={<LockKeyhole className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="press rounded-full p-1.5 text-muted-foreground transition hover:bg-accent hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="text-xs font-medium text-rose-600">{errors.newPassword.message}</p>
            ) : null}
          </div>

          <div className="login-field login-field-2 space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              icon={<ShieldCheck className="h-4 w-4" />}
              placeholder="Ulangi password baru"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-xs font-medium text-rose-600">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {!isSubmitting ? <KeyRound className="h-4 w-4" /> : null}
            Simpan password baru
          </Button>

          <Link
            href="/login"
            className="block text-center text-xs font-semibold text-primary transition hover:text-[#16389f]"
          >
            Kembali ke login
          </Link>
        </>
      )}
    </form>
  );
}
