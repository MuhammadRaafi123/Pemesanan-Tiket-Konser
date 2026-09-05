"use client";

import React from "react";
import { Event } from "../types";
import { EventCard } from "./EventCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";

interface EventGridProps {
  events: Event[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function EventGrid({
  events,
  emptyTitle = "Tidak Ada Konser Ditemukan",
  emptyDescription = "Coba ubah kata kunci pencarian atau filter genre kamu.",
}: EventGridProps) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Lihat Semua Konser"
        actionHref="/events"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
export default EventGrid;
