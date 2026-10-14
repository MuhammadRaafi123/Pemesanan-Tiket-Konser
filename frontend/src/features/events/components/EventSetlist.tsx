"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, ListMusic, Music4 } from "lucide-react";
import type { Event, SetlistEntry } from "../types";
import { fetchEventSetlist } from "../api";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";
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
      <section className="rounded-[28px] border border-border bg-white p-7 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <ListMusic className="h-3.5 w-3.5" />
              Setlist
            </p>
            <h2 className="font-display mt-4 text-3xl text-ink">Lagu yang dibawakan</h2>
          </div>
          <Badge variant="secondary">{songs.length} lagu</Badge>
        </div>

        {loading ? (
          <Loading message="Memuat daftar lagu..." />
        ) : songs.length === 0 ? (
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            Daftar lagu belum tersedia untuk konser ini.
          </p>
        ) : (
          <ol className="mt-7 space-y-1.5">
            {songs.map((entry) => (
              <li
                key={`${entry.song.id}-${entry.order}`}
                className="group flex flex-wrap items-center gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300 hover:border-border hover:bg-muted/50"
              >
                <span className="numeral flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground transition group-hover:border-primary/25 group-hover:text-primary">
                  {String(entry.order).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{entry.song.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {entry.artist ? (
                      <Link
                        href={`/artists/${entry.artist.id}`}
                        className="font-medium text-primary transition hover:text-[#16389f]"
                      >
                        {entry.artist.name}
                      </Link>
                    ) : (
                      "Artis tidak diketahui"
                    )}
                    {entry.song.album ? ` · ${entry.song.album}` : ""}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </p>
                </div>

                {entry.encore ? <Badge variant="gold">Encore</Badge> : null}

                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Music4 className="h-3.5 w-3.5" />
                  <Clock3 className="h-3.5 w-3.5" />
                  {entry.song.duration}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Reveal>
  );
}

export default EventSetlist;
