"use client";

import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/shared/SplashScreen";

export default function SplashPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0b0e15]">
      <SplashScreen showOnce={false} duration={2400} onComplete={() => router.replace("/")} />
    </main>
  );
}
