"use client";

import {
  useEffect,
} from "react";

import {
  useAuthStore,
} from "@/stores/authStore";

export const useAuth =
  () => {

    const {
      user,
      token,
      setAuth,
      setUser,
      logout,
      initializeAuth,
    } =
      useAuthStore();


    useEffect(() => {

      initializeAuth();

    }, [
      initializeAuth,
    ]);


    return {
      user,
      token,

      isAuthenticated:
        Boolean(token),

      setAuth,

      setUser,

      logout,
    };
  };