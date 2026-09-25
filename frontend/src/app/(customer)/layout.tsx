"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8ff] text-[#102a43]">
        <div className="text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" /><p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8aa4c1]">Checking your access</p></div>
      </main>
    );
  }

  return <>{children}</>;
}
