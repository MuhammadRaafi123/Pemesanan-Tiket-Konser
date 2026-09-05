import api from "@/lib/axios";
import { UserProfile } from "./types";

export async function fetchProfile(): Promise<UserProfile> {
  try {
    const res = await api.get("/auth/profile");
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  // Read stored user if available
  let storedName = "Muhammad Rafi";
  let storedEmail = "rafi@concertix.id";
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) storedName = u.name;
        if (u.email) storedEmail = u.email;
      } catch {}
    }
  }

  return {
    id: 1,
    name: storedName,
    email: storedEmail,
    phone: "081234567890",
    role: "customer",
    tickets_count: 2,
    orders_count: 2,
    favorite_genre: "Alternative Rock & EDM",
    joined_date: "Januari 2026",
  };
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const res = await api.put("/auth/profile", data);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  return {
    id: 1,
    name: data.name || "Muhammad Rafi",
    email: data.email || "rafi@concertix.id",
    phone: data.phone || "081234567890",
    role: "customer",
    tickets_count: 2,
    orders_count: 2,
    favorite_genre: data.favorite_genre || "Alternative Rock & EDM",
    joined_date: "Januari 2026",
  };
}
