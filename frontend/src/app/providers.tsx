"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Scroll-reveal styles stay disabled until hydration so server-rendered
    // markup is always readable, even before React boots.
    document.documentElement.classList.add("js-ready");
    return () => document.documentElement.classList.remove("js-ready");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {pathname !== "/splash" && <SplashScreen />}
        <PageTransition>{children}</PageTransition>
      </ToastProvider>
    </QueryClientProvider>
  );
}
