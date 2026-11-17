"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, Music, Radio, Share2 } from "lucide-react";
import type { Artist } from "../types";
import { EventCard } from "@/features/events/components/EventCard";
import { Stagger, Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";
import { resolveMediaUrl } from "@/lib/media";
import { usePathname } from "next/navigation";

interface ArtistInfoProps {
  artist: Artist;
}

export function ArtistInfo({ artist }: ArtistInfoProps) {
  const pathname = usePathname();
  const artistPath = pathname.startsWith("/home/") ? "/home/artists" : "/artists";
  const { success } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan profil artis berhasil disalin!");
    }
  };

  return (
    <div className="space-y-10">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-[#e8e5ef] bg-white p-6 shadow-[0_25px_70px_-25px_rgba(7,22,83,0.12)] sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#6264b5]/[0.1] blur-[80px]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(98,100,181,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(98,100,181,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)]" />

          <div className="relative flex items-center justify-between gap-4">
            <Link
              href={artistPath}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] px-3.5 py-2 text-xs font-semibold text-[#071653] transition hover:border-[#c8b7db] hover:text-[#6264b5]"
            >
              <ChevronLeft className="h-4 w-4" />
              Semua artis
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e5ef] bg-[#f7f4fa] text-[#5c6482] transition hover:border-[#c8b7db] hover:text-[#6264b5]"
              aria-label="Bagikan profil artis"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-9 flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="relative h-40 w-40 shrink-0">
              <span
                aria-hidden
                className="absolute -inset-3 rounded-full border border-dashed border-[#c8b7db]"
                style={{ animation: "spin 26s linear infinite" }}
              />
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-[#f7f4fa] shadow-[0_30px_60px_-30px_rgba(7,22,83,.25)]">
                <Image
                  src={resolveMediaUrl(artist.photo || "/globe.svg")}
                  alt={artist.name}
                  fill
                  priority
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-xs font-semibold text-[#6264b5]">
                  <Music className="h-3 w-3" />
                  {artist.genre || "Musisi"}
                </span>
                {artist.monthlyListeners ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#e8e5ef] bg-[#f7f4fa] px-3 py-1 text-xs font-medium text-[#5c6482]">
                    <Radio className="h-3 w-3 text-[#6264b5]" />
                    {artist.monthlyListeners} pendengar
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-[#071653]">
                {artist.name}
              </h1>

              {artist.description ? (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5c6482]">{artist.description}</p>
              ) : null}

              {artist.socials ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {Object.entries(artist.socials)
                    .filter(([, handle]) => Boolean(handle))
                    .map(([platform, handle]) => (
                      <span
                        key={platform}
                        className="rounded-full border border-[#e8e5ef] bg-[#f7f4fa] px-3 py-1 text-xs capitalize text-[#5c6482]"
                      >
                        {platform} · {handle}
                      </span>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </Reveal>

      <section>
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6264b5]">
              <CalendarDays className="h-3.5 w-3.5" />
              Jadwal
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#071653] sm:text-3xl">Konser {artist.name}</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5c6482]">
            Amankan tiket resmi sebelum kehabisan kuota panggung terdepan.
          </p>
        </Reveal>

        {artist.events && artist.events.length > 0 ? (
          <Stagger className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" step={80}>
            {artist.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Stagger>
        ) : (
          <Reveal delay={80} className="mt-8">
            <div className="rounded-2xl border border-dashed border-[#c8b7db] bg-white px-8 py-14 text-center text-sm text-[#5c6482]">
              Saat ini belum ada konser mendatang yang diumumkan untuk {artist.name}.
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
}

export default ArtistInfo;
