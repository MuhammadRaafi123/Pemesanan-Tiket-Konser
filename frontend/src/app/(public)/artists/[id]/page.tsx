"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Disc3 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistInfo } from "@/features/artists/components/ArtistInfo";
import { fetchArtistById } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { useAuthStore } from "@/stores/authStore";

export default function ArtistDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const pathname = usePathname();
  const router = useRouter();
  const artistsPath = pathname.startsWith("/home/") ? "/home/artists" : "/artists";
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && user && !pathname.startsWith("/home/")) {
      router.replace(`/home/artists/${id}`);
    }
  }, [hydrated, id, pathname, router, user]);

  useEffect(() => {
    let active = true;
    if (!id) return;

    fetchArtistById(id)
      .then((data) => {
        if (active) setArtist(data);
      })
      .catch(() => {
        if (active) setArtist(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pt-28 text-center">
          <Disc3 className="mb-5 h-8 w-8 animate-spin text-[#6264b5]" />
          <p className="text-sm font-medium text-[#071653]">Memuat profil artis...</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#5c6482]">Tixora</p>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pt-28">
          <div className="max-w-lg rounded-2xl border border-[#e8e5ef] bg-white px-8 py-12 text-center shadow-[0_18px_44px_-28px_rgba(13,38,84,0.2)]">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]">
              <Disc3 className="h-6 w-6" />
            </span>
            <h1 className="text-xl font-bold text-[#071653]">Artis tidak ditemukan</h1>
            <p className="mt-3 text-sm leading-6 text-[#5c6482]">
              Data musisi tidak tersedia atau belum terdaftar di sistem.
            </p>
            <Link
              href={artistsPath}
              className="mt-6 inline-flex items-center rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#51539f]"
            >
              Kembali ke semua artis
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <ArtistInfo artist={artist} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
