import { z } from "zod";


// =====================================================
// LOGIN
// =====================================================

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(
      1,
      "Password wajib diisi"
    ),
});


// =====================================================
// REGISTER
// =====================================================

export const registerSchema = z.object({
  name: z
    .string()
    .min(
      3,
      "Nama minimal 3 karakter"
    )
    .max(
      150,
      "Nama maksimal 150 karakter"
    ),

  email: z
    .string()
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(
      6,
      "Password minimal 6 karakter"
    )
    .max(
      100,
      "Password maksimal 100 karakter"
    ),

  phone: z
    .string()
    .min(
      8,
      "Nomor telepon minimal 8 karakter"
    )
    .max(
      30,
      "Nomor telepon maksimal 30 karakter"
    )
    .optional(),
});


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .email(
        "Format email tidak valid"
      ),
  });


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPasswordSchema =
  z
    .object({
      newPassword: z
        .string()
        .min(
          6,
          "Password baru minimal 6 karakter"
        )
        .max(
          100,
          "Password baru maksimal 100 karakter"
        ),

      confirmPassword: z
        .string()
        .min(
          1,
          "Konfirmasi password wajib diisi"
        ),
    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        path: [
          "confirmPassword",
        ],
        message:
          "Konfirmasi password tidak cocok",
      }
    );

export type LoginFormValues =
  z.infer<typeof loginSchema>;

export type RegisterFormValues =
  z.infer<typeof registerSchema>;

export type ForgotPasswordFormValues =
  z.infer<
    typeof forgotPasswordSchema
  >;

export type ResetPasswordFormValues =
  z.infer<
    typeof resetPasswordSchema
  >;  