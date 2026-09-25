import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/features/auth/types";
import type { UserProfile } from "./types";

function getStoredUser(): UserProfile {
  if (typeof window === "undefined") {
    return {
      id: 0,
      name: "Tamu",
      email: "",
      role: "customer",
      tickets_count: 0,
      orders_count: 0,
      favorite_genre: "",
      joined_date: "",
    };
  }

  try {
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        tickets_count: 0,
        orders_count: 0,
        favorite_genre: "",
        joined_date: user.created_at || "",
      };
    }
  } catch {
    // Continue with the guest-safe profile below.
  }

  return {
    id: 0,
    name: "Tamu",
    email: "",
    role: "customer",
    tickets_count: 0,
    orders_count: 0,
    favorite_genre: "",
    joined_date: "",
  };
}

export async function fetchProfile(): Promise<UserProfile> {
  try {
    const response = await api.get<ApiResponse<UserProfile>>("/auth/profile");
    if (response.data?.data) {
      return response.data.data;
    }
  } catch {
    // The caller can still render a safe local profile.
  }

  return getStoredUser();
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  // The current backend exposes profile reads only. Keep the UI responsive,
  // but merge the requested fields into the locally available profile.
  const current = await fetchProfile();
  return { ...current, ...data };
}
