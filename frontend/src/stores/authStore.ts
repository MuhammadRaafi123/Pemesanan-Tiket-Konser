"use client";

import {
  create,
} from "zustand";

import type {
  User,
} from "@/features/auth/types";

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;

  setAuth: (
    user: User,
    token: string
  ) => void;

  setUser: (
    user: User
  ) => void;

  logout: () => void;

  initializeAuth: () => void;
  syncSessionCookie: (user: User | null) => void;
}

export const useAuthStore =
  create<AuthState>(
    (set, get) => ({

      // Proxy runs before the client app and cannot read localStorage. Keep a
      // small, non-sensitive session hint in a cookie for route redirects.
      // The API remains responsible for validating the actual access token.
      syncSessionCookie: (user: User | null) => {
        if (typeof document === "undefined") return;

        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        if (!user) {
          document.cookie = `tixora_session=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
          document.cookie = `tixora_role=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
          return;
        }

        document.cookie = `tixora_session=1; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
        document.cookie = `tixora_role=${encodeURIComponent(user.role)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
      },

      user: null,

      token: null,

      hydrated: false,


      // ===================================
      // SET AUTH
      // ===================================

      setAuth: (
        user,
        token
      ) => {

        get().syncSessionCookie(user);

        localStorage.setItem(
          "access_token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        set({
          user,
          token,
          hydrated: true,
        });
      },


      // ===================================
      // SET USER
      // ===================================

      setUser: (
        user
      ) => {

        get().syncSessionCookie(user);

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        set({
          user,
        });
      },


      // ===================================
      // LOGOUT
      // ===================================

      logout: () => {

        get().syncSessionCookie(null);

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );

        set({
          user: null,
          token: null,
          hydrated: true,
        });
      },


      // ===================================
      // INITIALIZE
      // ===================================

      initializeAuth: () => {
        if (typeof window === "undefined") {
          set({ hydrated: true });
          return;
        }

        const token =
          window.localStorage.getItem(
            "access_token"
          );

        const storedUser =
          window.localStorage.getItem(
            "user"
          );

        let user: User | null = null;

        if (storedUser) {
          try {
            user = JSON.parse(storedUser) as User;
          } catch {
            window.localStorage.removeItem("user");
          }
        }

        set({
          token,
          user,
          hydrated: true,
        });

        get().syncSessionCookie(token && user ? user : null);
      },

    })
  );
