import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

import supabase from "../config/supabase.js";


const resend = new Resend(
  process.env.RESEND_API_KEY
);


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async ({
  name,
  email,
  password,
  phone,
}) => {

  const {
    data: existingUser,
    error: checkError,
  } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();


  if (checkError) {
    throw checkError;
  }


  if (existingUser) {
    const error = new Error(
      "Email sudah terdaftar"
    );

    error.statusCode = 409;

    throw error;
  }


  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );


  const {
    data: user,
    error: insertError,
  } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: "customer",
    })
    .select()
    .single();


  if (insertError) {
    throw insertError;
  }


  delete user.password;

  return user;
};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async ({
  email,
  password,
}) => {

  const {
    data: user,
    error,
  } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();


  if (error) {
    throw error;
  }


  if (!user) {
    const loginError =
      new Error(
        "Email atau password salah"
      );

    loginError.statusCode = 401;

    throw loginError;
  }


  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );


  if (!isPasswordValid) {
    const loginError =
      new Error(
        "Email atau password salah"
      );

    loginError.statusCode = 401;

    throw loginError;
  }


  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "7d",
    }
  );


  delete user.password;

  return {
    user,
    token,
  };
};


// =====================================================
// GET USER BY ID
// =====================================================

export const getUserById =
  async (userId) => {

    const {
      data: user,
      error,
    } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        phone,
        role,
        created_at
      `)
      .eq(
        "id",
        userId
      )
      .single();


    if (error) {
      throw error;
    }


    return user;
  };


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPasswordUser =
  async (email) => {

    const {
      data: user,
      error,
    } = await supabase
      .from("users")
      .select("id, name, email")
      .eq(
        "email",
        email
      )
      .maybeSingle();


    if (error) {
      throw error;
    }


    // Jangan membocorkan apakah email
    // terdaftar atau tidak.
    if (!user) {
      return;
    }


    // Token random 32 byte
    const resetToken =
      crypto.randomBytes(32).toString(
        "hex"
      );


    // Simpan hash token
    const tokenHash =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


    // Token berlaku 15 menit
    const expiresAt =
      new Date(
        Date.now() +
          15 * 60 * 1000
      ).toISOString();


    const {
      error: updateError,
    } = await supabase
      .from("users")
      .update({
        reset_password_token:
          tokenHash,

        reset_password_expires_at:
          expiresAt,
      })
      .eq(
        "id",
        user.id
      );


    if (updateError) {
      throw updateError;
    }


    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;


    const {
      error: emailError,
    } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "onboarding@resend.dev",

      to: user.email,

      subject:
        "Reset Password Akun Kamu",

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Reset Password</h2>

          <p>
            Halo ${user.name},
          </p>

          <p>
            Kami menerima permintaan
            untuk mengatur ulang password
            akun kamu.
          </p>

          <p>
            Klik tombol berikut untuk
            membuat password baru:
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#000;
                color:#fff;
                text-decoration:none;
                border-radius:6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            Link ini berlaku selama
            15 menit.
          </p>

          <p>
            Kalau kamu tidak meminta
            reset password, abaikan email ini.
          </p>
        </div>
      `,
    });


    if (emailError) {
      throw emailError;
    }

    return;
  };


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPasswordUser =
  async ({
    token,
    new_password,
  }) => {

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    const {
      data: user,
      error: findError,
    } = await supabase
      .from("users")
      .select(`
        id,
        email,
        reset_password_token,
        reset_password_expires_at
      `)
      .eq(
        "reset_password_token",
        tokenHash
      )
      .maybeSingle();


    if (findError) {
      throw findError;
    }


    if (!user) {
      const error = new Error(
        "Token reset tidak valid"
      );

      error.statusCode = 400;

      throw error;
    }


    const expiresAt =
      new Date(
        user.reset_password_expires_at
      );


    if (
      Number.isNaN(
        expiresAt.getTime()
      ) ||
      expiresAt <= new Date()
    ) {
      // Token expired → hapus
      await supabase
        .from("users")
        .update({
          reset_password_token: null,

          reset_password_expires_at:
            null,
        })
        .eq(
          "id",
          user.id
        );


      const error = new Error(
        "Token reset sudah kadaluarsa"
      );

      error.statusCode = 400;

      throw error;
    }


    const hashedPassword =
      await bcrypt.hash(
        new_password,
        10
      );


    const {
      error: updateError,
    } = await supabase
      .from("users")
      .update({
        password:
          hashedPassword,

        reset_password_token:
          null,

        reset_password_expires_at:
          null,
      })
      .eq(
        "id",
        user.id
      );


    if (updateError) {
      throw updateError;
    }


    return;
  };