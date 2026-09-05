"use client";

import { useState } from "react";
import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";

import {
  registerUser,
} from "@/features/auth/api";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

export default function RegisterForm() {
  const [serverError, setServerError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
    reset,
  } = useForm<RegisterFormValues>({
    resolver:
      zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: RegisterFormValues
  ) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      });

      setSuccessMessage(
        "Registrasi berhasil. Silakan login dengan akun kamu."
      );

      reset();

    } catch (error: unknown) {
      const err =
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

      const message =
        err?.response?.data?.message ||
        "Registrasi gagal. Silakan coba lagi.";

      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-5"
    >
      {/* ========================================= */}
      {/* ERROR */}
      {/* ========================================= */}

      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
          {serverError}
        </div>
      )}

      {/* ========================================= */}
      {/* SUCCESS */}
      {/* ========================================= */}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* ========================================= */}
      {/* NAME */}
      {/* ========================================= */}

      <div className="space-y-2">
        <Label htmlFor="name">
          Nama Lengkap
        </Label>

        <Input
          id="name"
          type="text"
          placeholder="Masukkan nama lengkap"
          autoComplete="name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* ========================================= */}
      {/* EMAIL */}
      {/* ========================================= */}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* ========================================= */}
      {/* PHONE */}
      {/* ========================================= */}

      <div className="space-y-2">
        <Label htmlFor="phone">
          Nomor Telepon
        </Label>

        <Input
          id="phone"
          type="tel"
          placeholder="081234567890"
          autoComplete="tel"
          {...register("phone")}
        />

        {errors.phone && (
          <p className="text-sm text-red-400">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* ========================================= */}
      {/* PASSWORD */}
      {/* ========================================= */}

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          type="password"
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ========================================= */}
      {/* SUBMIT */}
      {/* ========================================= */}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Mendaftarkan..."
          : "Daftar Sekarang"}
      </Button>

      {/* ========================================= */}
      {/* LOGIN LINK */}
      {/* ========================================= */}

      <p className="text-center text-sm text-white/45">
        Sudah punya akun?{" "}

        <Link
          href="/login"
          className="font-semibold text-violet-400 transition hover:text-violet-300"
        >
          Login
        </Link>
      </p>
    </form>
  );
}