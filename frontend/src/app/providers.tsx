"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { useAuthStore } from "@/stores/authStore";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {pathname !== "/splash" && <SplashScreen />}
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
