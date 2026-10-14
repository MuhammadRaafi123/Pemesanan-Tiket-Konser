"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Disc3 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && user) {
      router.replace(user.role === "admin" ? "/admin" : "/home");
    }
  }, [hydrated, router, user]);

  if (!hydrated || user) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center bg-[#0b0e15] text-center text-[#e1e2ec]"
        role="status"
        aria-live="polite"
      >
        <Disc3 className="mb-5 h-8 w-8 animate-spin text-[#ffb703]" />
        <p className="text-sm font-medium">Mengarahkan ke ruang akunmu...</p>
      </main>
    );
  }

  return children;
}

export default GuestOnly;
