"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { registerUser } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="login-field login-field-1 space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nama lengkap</Label>
          <Input
            id="name"
            icon={<UserRound className="h-4 w-4" />}
            placeholder="Nama kamu"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name ? <p className="text-xs font-medium text-rose-600">{errors.name.message}</p> : null}
        </div>

        <div className="login-field login-field-1 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? <p className="text-xs font-medium text-rose-600">{errors.email.message}</p> : null}
        </div>

        <div className="login-field login-field-2 space-y-2">
          <Label htmlFor="phone">
            Nomor telepon <span className="font-normal text-muted-foreground/70">(opsional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="0812 3456 7890"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone ? <p className="text-xs font-medium text-rose-600">{errors.phone.message}</p> : null}
        </div>

        <div className="login-field login-field-2 space-y-2 sm:col-span-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
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
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? <p className="text-xs font-medium text-rose-600">{errors.password.message}</p> : null}
          <p className="text-[0.68rem] leading-5 text-muted-foreground/80">
            Gunakan password yang kuat dan unik untuk akunmu.
          </p>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        {!isSubmitting ? <CheckCircle2 className="h-4 w-4" /> : null}
        Buat akun saya
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary transition hover:text-[#16389f]">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
