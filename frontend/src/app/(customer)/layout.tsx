"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/shared/Loading";
import { useAuthStore } from "@/stores/authStore";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, router, user]);

  if (!hydrated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-ink">
        <Loading message="Memeriksa aksesmu..." />
      </main>
    );
  }

  return <>{children}</>;
}
