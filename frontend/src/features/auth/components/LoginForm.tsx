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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <div className="login-field login-field-1 space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@gmail.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? <p className="text-xs font-medium text-rose-600">{errors.email.message}</p> : null}
      </div>

      <div className="login-field login-field-2 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs font-semibold text-primary transition hover:text-[#16389f]">
            Lupa password?
          </Link>
        </div>
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
          placeholder="Masukkan password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? <p className="text-xs font-medium text-rose-600">{errors.password.message}</p> : null}
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        {!isSubmitting ? <LogIn className="h-4 w-4" /> : null}
        Masuk ke Concertix
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary transition hover:text-[#16389f]">
          Buat akun gratis
        </Link>
      </p>
    </form>
  );
}
