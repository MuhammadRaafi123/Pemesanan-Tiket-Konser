import api from "@/lib/axios";

import type { ApiResponse } from "@/types/api";

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from "@/features/auth/types";

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<
    ApiResponse<LoginResponse>
  >("/auth/login", payload);

  return response.data.data;
};

// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (
  payload: RegisterPayload
): Promise<User> => {
  const response = await api.post<
    ApiResponse<User>
  >("/auth/register", payload);

  return response.data.data;
};

// =====================================================
// GET PROFILE
// =====================================================

export const getProfile = async (): Promise<User> => {
  const response = await api.get<
    ApiResponse<User>
  >("/auth/profile");

  return response.data.data;
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (
  email: string
): Promise<void> => {
  await api.post("/auth/forgot-password", {
    email,
  });
};

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await api.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
};