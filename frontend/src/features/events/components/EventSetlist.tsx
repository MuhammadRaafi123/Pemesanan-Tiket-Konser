"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Disc3, ListMusic, Music4 } from "lucide-react";
import type { Event, SetlistEntry } from "../types";
import { fetchEventSetlist } from "../api";
import { Reveal } from "@/components/shared/Reveal";

interface EventSetlistProps {
  event: Event;
}

export function EventSetlist({ event }: EventSetlistProps) {
  const [songs, setSongs] = useState<SetlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchEventSetlist(event.id)
      .then((data) => {
        if (active) setSongs(data);
      })
      .catch(() => {
        if (active) setSongs(event.setlist || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [event.id, event.setlist]);

  return (
    <Reveal>
      <section className="rounded-3xl border border-[#262a38] bg-[#14161f] p-7 sm:p-9 shadow-xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#232733]/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d5baff]/30 bg-[#d5baff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d5baff]">
              <ListMusic className="h-3.5 w-3.5" />
              <span>Bocoran Setlist Konser</span>
            </div>
            <h2 className="mt-2.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Lagu Yang Akan Dibawakan
            </h2>
          </div>
          <span className="rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-3.5 py-1.5 text-xs font-bold text-[#ffdea9]">
            {songs.length} Lagu Dikonfirmasi
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Disc3 className="h-8 w-8 text-[#ffb703] animate-spin mb-3" />
            <p className="text-xs text-[#8a8d98]">Memuat daftar setlist lagu...</p>
          </div>
        ) : songs.length === 0 ? (
          <p className="mt-6 text-xs sm:text-sm text-[#8a8d98]">
            Daftar lagu resmi belum dirilis oleh promotor untuk tanggal konser ini.
          </p>
        ) : (
          <ol className="mt-7 space-y-2.5">
            {songs.map((entry) => (
              <li
                key={`${entry.song.id}-${entry.order}`}
                className="group flex flex-wrap items-center gap-4 rounded-2xl border border-[#232733] bg-[#1a1d27]/70 p-3.5 px-4 transition-all duration-300 hover:border-[#ffb703]/35 hover:bg-[#1f2230]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ffb703]/25 bg-[#ffb703]/10 font-mono text-xs font-black text-[#ffb703]">
                  {String(entry.order).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white transition group-hover:text-[#ffb703] sm:text-base">
                    {entry.song.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#8a8d98]">
                    {entry.artist ? (
                      <Link
                        href={`/artists/${entry.artist.id}`}
                        className="font-semibold text-[#d5baff] transition hover:underline"
                      >
                        {entry.artist.name}
                      </Link>
                    ) : (
                      "Artis Utama"
                    )}
                    {entry.song.album ? ` · Album: ${entry.song.album}` : ""}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </p>
                </div>

                {entry.encore ? (
                  <span className="rounded-full border border-[#ffb703]/40 bg-[#ffb703]/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#ffdea9] shadow-sm">
                    Encore Stage
                  </span>
                ) : null}

                {entry.song.duration && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8d98]">
                    <Clock3 className="h-3.5 w-3.5 text-[#ffb703]" />
                    <span>{entry.song.duration}</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </Reveal>
  );
}

export default EventSetlist;
