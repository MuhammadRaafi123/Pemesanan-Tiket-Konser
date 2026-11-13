import supabase from "../config/supabase.js";
import { successResponse } from "../utils/apiResponse.js";

export const getAdminUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return successResponse(res, "Data pengguna berhasil diambil", data);
  } catch (error) {
    next(error);
  }
};
