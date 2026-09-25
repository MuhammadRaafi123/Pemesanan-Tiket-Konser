"use client";

import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/shared/SplashScreen";

export default function SplashPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <SplashScreen
        showOnce={false}
        duration={2400}
        onComplete={() => router.replace("/")}
      />
      <div className="flex min-h-screen flex-col items-center justify-end px-6 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8aa4c1]">Opening your live experience</p>
      </div>
    </main>
  );
}
