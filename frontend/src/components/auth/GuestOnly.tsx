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
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf2] px-5 text-[#071653]" role="status" aria-live="polite">
        <div className="w-full max-w-sm rounded-3xl border border-[#e8e5ef] bg-white p-8 text-center shadow-[0_24px_70px_-42px_rgba(51,37,86,.25)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9d5ee] bg-[#f2effb] text-[#6264b5]">
            <Disc3 className="h-8 w-8 animate-spin" />
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Tixora · Akun</p>
          <h1 className="mt-2 text-xl font-bold tracking-tight">Menyiapkan ruang akunmu</h1>
          <p className="mt-2 text-sm leading-6 text-[#68708a]">Sebentar, kami sedang membuka halaman yang tepat untukmu.</p>
          <div aria-hidden="true" className="mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-[#eeebf4]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#6264b5]" />
          </div>
        </div>
      </main>
    );
  }

  return children;
}

export default GuestOnly;
