"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistInfo } from "@/features/artists/components/ArtistInfo";
import { fetchArtistById } from "@/features/artists/api";
import { Artist } from "@/features/artists/types";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ArtistDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArtistById(id).then((data) => {
        setArtist(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat profil artis..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <ErrorState
            title="Artis Tidak Ditemukan"
            message="Data musisi tidak tersedia atau belum terdaftar di sistem."
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ArtistInfo artist={artist} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
