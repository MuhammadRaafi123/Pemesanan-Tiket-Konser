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

  setAuth: (
    user: User,
    token: string
  ) => void;

  setUser: (
    user: User
  ) => void;

  logout: () => void;

  initializeAuth: () => void;
}

export const useAuthStore =
  create<AuthState>(
    (set) => ({

      user: null,

      token: null,


      // ===================================
      // SET AUTH
      // ===================================

      setAuth: (
        user,
        token
      ) => {

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
        });
      },


      // ===================================
      // SET USER
      // ===================================

      setUser: (
        user
      ) => {

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

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );

        set({
          user: null,
          token: null,
        });
      },


      // ===================================
      // INITIALIZE
      // ===================================

      initializeAuth: () => {

        const token =
          localStorage.getItem(
            "access_token"
          );

        const storedUser =
          localStorage.getItem(
            "user"
          );


        let user: User | null =
          null;


        if (storedUser) {

          try {

            user =
              JSON.parse(
                storedUser
              );

          } catch {

            localStorage.removeItem(
              "user"
            );

          }

        }


        set({
          token,
          user,
        });
      },

    })
  );