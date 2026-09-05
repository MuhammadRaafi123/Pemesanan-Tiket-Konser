"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";

import {
  forgotPassword,
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

export default function ForgotPasswordForm() {
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
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(
      forgotPasswordSchema
    ),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    values: ForgotPasswordFormValues
  ) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword(
        values.email
      );

      setSuccessMessage(
        "Jika email terdaftar, link reset password telah dikirim. Silakan cek inbox kamu."
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
        "Terjadi kesalahan. Silakan coba lagi.";

      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* SERVER ERROR */}
      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
          {serverError}
        </div>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* EMAIL */}
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

        <p className="text-xs leading-5 text-white/35">
          Masukkan email yang kamu gunakan
          untuk mendaftar akun Concertix.
        </p>
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Mengirim..."
          : "Kirim Link Reset"}
      </Button>

      {/* BACK TO LOGIN */}
            <p className="mt-6 text-center text-sm text-white/45">
              Ingat password kamu?{" "}
              <Link href="/login" className="font-semibold text-violet-400 transition hover:text-violet-300">
                Kembali ke login
              </Link>
            </p>
    </form>
  );
}