import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

export const registerUser = async ({
  name,
  email,
  password,
  phone,
}) => {
  // Cek apakah email sudah digunakan
  const { data: existingUser, error: checkError } =
    await supabase
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

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Simpan user
  const { data: user, error: insertError } =
    await supabase
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

  // Jangan kirim password
  delete user.password;

  return user;
};


export const loginUser = async ({
  email,
  password,
}) => {
  // Cari user berdasarkan email
  const { data: user, error } =
    await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!user) {
    const loginError = new Error(
      "Email atau password salah"
    );

    loginError.statusCode = 401;

    throw loginError;
  }

  // Bandingkan password
  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    const loginError = new Error(
      "Email atau password salah"
    );

    loginError.statusCode = 401;

    throw loginError;
  }

  // Generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  // Jangan kirim password
  delete user.password;

  return {
    user,
    token,
  };
};


export const getUserById = async (userId) => {
  const { data: user, error } =
    await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        phone,
        role,
        created_at
      `)
      .eq("id", userId)
      .single();

  if (error) {
    throw error;
  }

  return user;
};