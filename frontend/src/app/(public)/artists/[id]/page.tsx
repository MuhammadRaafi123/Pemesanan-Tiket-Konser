"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Disc3 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistInfo } from "@/features/artists/components/ArtistInfo";
import { fetchArtistById } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";

export default function ArtistDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pt-28 text-center">
          <Disc3 className="mb-5 h-8 w-8 animate-spin text-[#ffb703]" />
          <p className="text-sm font-medium text-[#e1e2ec]">Memuat profil artis...</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7a7d88]">Concertix</p>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pt-28">
          <div className="max-w-lg rounded-2xl border border-[#2a2d36] bg-[#191b23] px-8 py-12 text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]">
              <Disc3 className="h-6 w-6" />
            </span>
            <h1 className="text-xl font-bold text-[#e1e2ec]">Artis tidak ditemukan</h1>
            <p className="mt-3 text-sm leading-6 text-[#8a8d98]">
              Data musisi tidak tersedia atau belum terdaftar di sistem.
            </p>
            <Link
              href="/artists"
              className="mt-6 inline-flex items-center rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
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
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <ArtistInfo artist={artist} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
