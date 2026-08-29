import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";

import {
  successResponse,
} from "../utils/apiResponse.js";


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

    const user = await registerUser({
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

    const result = await loginUser({
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


export const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user = await getUserById(
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