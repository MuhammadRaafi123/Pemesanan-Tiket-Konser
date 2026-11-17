"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Disc3, ListMusic } from "lucide-react";
import type { Event, SetlistEntry } from "../types";
import { fetchEventSetlist } from "../api";
import { Reveal } from "@/components/shared/Reveal";
import { usePathname } from "next/navigation";

interface EventSetlistProps {
  event: Event;
}

export function EventSetlist({ event }: EventSetlistProps) {
  const pathname = usePathname();
  const artistPath = pathname.startsWith("/home/") ? "/home/artists" : "/artists";
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
      <section className="rounded-2xl border border-[#e8e5ef] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e8e5ef] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
              <ListMusic className="h-3.5 w-3.5" />
              <span>Bocoran Setlist Konser</span>
            </div>
            <h2 className="mt-2.5 text-xl font-bold tracking-tight text-[#071653] sm:text-2xl">
              Lagu Yang Akan Dibawakan
            </h2>
          </div>
          <span className="rounded-lg bg-[#f7f4fa] px-3 py-1.5 text-xs font-semibold text-[#6264b5]">
            {songs.length} Lagu Dikonfirmasi
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Disc3 className="h-8 w-8 text-[#6264b5] animate-spin mb-3" />
            <p className="text-xs text-[#5c6482]">Memuat daftar setlist lagu...</p>
          </div>
        ) : songs.length === 0 ? (
          <p className="mt-6 text-xs sm:text-sm text-[#5c6482]">
            Daftar lagu resmi belum dirilis oleh promotor untuk tanggal konser ini.
          </p>
        ) : (
          <ol className="mt-5 space-y-2">
            {songs.map((entry) => (
              <li
                key={`${entry.song.id}-${entry.order}`}
                className="group flex flex-wrap items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] p-3 transition-colors duration-200 hover:border-[#c8b7db]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eeebf4] font-mono text-xs font-bold text-[#6264b5]">
                  {String(entry.order).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#071653] transition group-hover:text-[#6264b5]">
                    {entry.song.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#5c6482]">
                    {entry.artist ? (
                      <Link
                        href={`${artistPath}/${entry.artist.id}`}
                        className="font-semibold text-[#6264b5] transition hover:underline"
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
                  <span className="rounded-full border border-[#c8b7db] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#6264b5] shadow-sm">
                    Encore Stage
                  </span>
                ) : null}

                {entry.song.duration && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5c6482]">
                    <Clock3 className="h-3.5 w-3.5 text-[#6264b5]" />
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
