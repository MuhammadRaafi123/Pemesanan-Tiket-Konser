"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";

import {
  resetPassword,
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


export default function ResetPasswordForm() {
  const [token, setToken] =
    useState<string | null>(null);

  const [tokenLoading, setTokenLoading] =
    useState(true);

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
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(
      resetPasswordSchema
    ),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });


  // =====================================================
  // AMBIL TOKEN DARI URL
  // =====================================================

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const resetToken =
      params.get("token");

    setToken(resetToken);
    setTokenLoading(false);
  }, []);


  // =====================================================
  // SUBMIT RESET PASSWORD
  // =====================================================

  const onSubmit = async (
    values: ResetPasswordFormValues
  ) => {
    setServerError(null);
    setSuccessMessage(null);


    if (!token) {
      setServerError(
        "Token reset tidak ditemukan."
      );

      return;
    }


    try {
      await resetPassword(
        token,
        values.newPassword
      );


      setSuccessMessage(
        "Password berhasil diubah. Silakan login dengan password baru kamu."
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
        "Link reset password tidak valid atau sudah kadaluarsa.";


      setServerError(
        message
      );
    }
  };


  // =====================================================
  // LOADING TOKEN
  // =====================================================

  if (tokenLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-white/50">
          Memuat...
        </div>
      </div>
    );
  }


  // =====================================================
  // TOKEN TIDAK ADA
  // =====================================================

  if (!token) {
    return (
      <div className="space-y-6 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
          ⚠️
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Link tidak valid
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Token reset password tidak ditemukan.
            Silakan minta link reset password baru.
          </p>
        </div>

        <Link
          href="/forgot-password"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Minta Link Baru
        </Link>

      </div>
    );
  }


  // =====================================================
  // FORM RESET PASSWORD
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-5"
    >

      {/* ERROR */}
      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
          {serverError}
        </div>
      )}


      {/* SUCCESS */}
      {successMessage && (
        <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">

          <p className="text-sm leading-6 text-emerald-300">
            {successMessage}
          </p>

          <Link
            href="/login"
            className="inline-flex text-sm font-semibold text-emerald-300 underline underline-offset-4"
          >
            Kembali ke Login
          </Link>

        </div>
      )}


      {!successMessage && (
        <>
          {/* PASSWORD BARU */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              Password Baru
            </Label>

            <Input
              id="newPassword"
              type="password"
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              {...register(
                "newPassword"
              )}
            />

            {errors.newPassword && (
              <p className="text-sm text-red-400">
                {
                  errors.newPassword
                    .message
                }
              </p>
            )}
          </div>


          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Konfirmasi Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password baru"
              autoComplete="new-password"
              {...register(
                "confirmPassword"
              )}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-400">
                {
                  errors.confirmPassword
                    .message
                }
              </p>
            )}
          </div>


          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Menyimpan..."
              : "Ubah Password"}
          </Button>


          {/* BACK */}
          <Link
            href="/login"
            className="flex items-center justify-center text-sm font-medium text-white/45 transition hover:text-white"
          >
            ← Kembali ke login
          </Link>
        </>
      )}

    </form>
  );
}