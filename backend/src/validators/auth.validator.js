import { z } from "zod";


// =====================================================
// REGISTER
// =====================================================

export const registerSchema = z.object({
  body: z.object({
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
      .email(
        "Format email tidak valid"
      ),

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
  }),
});


// =====================================================
// LOGIN
// =====================================================

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email(
        "Format email tidak valid"
      ),

    password: z
      .string()
      .min(
        1,
        "Password wajib diisi"
      ),
  }),
});


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPasswordSchema =
  z.object({
    body: z.object({
      email: z
        .string()
        .email(
          "Format email tidak valid"
        ),
    }),
  });


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPasswordSchema =
  z.object({
    body: z.object({
      token: z
        .string()
        .min(
          1,
          "Token reset wajib diisi"
        ),

      new_password: z
        .string()
        .min(
          6,
          "Password baru minimal 6 karakter"
        )
        .max(
          100,
          "Password baru maksimal 100 karakter"
        ),
    }),
  });