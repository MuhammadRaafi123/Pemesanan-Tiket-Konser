import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Nama minimal 3 karakter")
      .max(150, "Nama maksimal 150 karakter"),

    email: z
      .string()
      .email("Format email tidak valid"),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),

    phone: z
      .string()
      .min(8, "Nomor telepon minimal 8 karakter")
      .max(30, "Nomor telepon maksimal 30 karakter")
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Format email tidak valid"),

    password: z
      .string()
      .min(1, "Password wajib diisi"),
  }),
});