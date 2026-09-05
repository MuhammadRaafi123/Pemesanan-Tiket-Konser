import {
  registerUser,
  loginUser,
  getUserById,
  forgotPasswordUser,
  resetPasswordUser,
} from "../services/auth.service.js";

import {
  successResponse,
} from "../utils/apiResponse.js";


// =====================================================
// REGISTER
// =====================================================

export const register = async (
  req,
  res,
  next
) => {
  try {

    const {
      name,
      email,
      password,
      phone,
    } = req.validated.body;


    const user =
      await registerUser({
        name,
        email,
        password,
        phone,
      });


    return successResponse(
      res,
      "Registrasi berhasil",
      user,
      201
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (
  req,
  res,
  next
) => {
  try {

    const {
      email,
      password,
    } = req.validated.body;


    const result =
      await loginUser({
        email,
        password,
      });


    return successResponse(
      res,
      "Login berhasil",
      result
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// PROFILE
// =====================================================

export const getProfile = async (
  req,
  res,
  next
) => {
  try {

    const user =
      await getUserById(
        req.user.id
      );


    return successResponse(
      res,
      "Profile berhasil diambil",
      user
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        email,
      } = req.validated.body;


      await forgotPasswordUser(
        email
      );


      // Sengaja menggunakan response
      // yang sama walaupun email
      // tidak ditemukan.
      return successResponse(
        res,
        "Jika email terdaftar, link reset password telah dikirim"
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        token,
        new_password,
      } = req.validated.body;


      await resetPasswordUser({
        token,
        new_password,
      });


      return successResponse(
        res,
        "Password berhasil diubah"
      );

    } catch (error) {
      next(error);
    }
  };