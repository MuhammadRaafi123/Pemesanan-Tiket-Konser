"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from "lucide-react";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schema";
import { loginUser } from "@/features/auth/api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const result = await loginUser(values);
      setAuth(result.user, result.token);
      window.location.href = "/";
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Login gagal. Silakan periksa email dan password.";
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ERROR */}
      {serverError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* EMAIL */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-bold text-white/70">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="nama@email.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-bold text-white/70">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-purple-400 transition hover:text-purple-300"
          >
            Lupa password?
          </Link>
        </div>

        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          icon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/40 hover:text-white transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          placeholder="Masukkan password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-rose-400">{errors.password.message}</p>
        )}
      </div>

      {/* LOGIN BUTTON */}
      <Button
        type="submit"
        variant="glow"
        size="lg"
        className="w-full gap-2 text-sm"
        isLoading={isSubmitting}
      >
        <LogIn className="h-4 w-4" />
        <span>Masuk ke Akun</span>
      </Button>

      {/* REGISTER LINK */}
      <p className="text-center text-xs text-white/50 pt-1">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-bold text-purple-400 transition hover:text-purple-300 underline underline-offset-4"
        >
          Daftar Sekarang
        </Link>
      </p>
    </form>
  );
}