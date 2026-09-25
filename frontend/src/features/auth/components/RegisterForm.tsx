"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";
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
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      password: "",
    },
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

      setSuccessMessage("Akun berhasil dibuat. Sekarang, masuk untuk menemukan live moment berikutnya.");
      reset();
    } catch (error: unknown) {
      setServerError(
        getApiErrorMessage(error, "Registrasi gagal. Silakan coba lagi."),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Nama lengkap</Label>
          <Input
            id="name"
            icon={<UserRound className="h-4 w-4" />}
            placeholder="Nama kamu"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-rose-300">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Email</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Nomor telepon <span className="text-[#6683a3]/25">(opsional)</span></Label>
          <Input
            id="phone"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="0812 3456 7890"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone && <p className="text-xs text-rose-300">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="password" className="text-xs font-medium tracking-wide text-[#6683a3]/65">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            icon={<LockKeyhole className="h-4 w-4" />}
            rightIcon={(
              <button
                type="button"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-lg p-1 text-[#6683a3]/35 transition hover:text-[#2563eb]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-rose-300">{errors.password.message}</p>}
          <p className="text-[11px] leading-5 text-[#6683a3]/30">Gunakan password yang kuat dan unik untuk akunmu.</p>
        </div>
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isSubmitting}>
        {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
        Buat akun saya
      </Button>

      <p className="text-center text-xs leading-5 text-[#6683a3]/30">
        Dengan membuat akun, kamu menyetujui pengalaman Concertix yang lebih personal.
      </p>

      <p className="text-center text-sm text-[#6683a3]/45">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-[#2563eb] transition hover:text-[#60a5fa]">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
