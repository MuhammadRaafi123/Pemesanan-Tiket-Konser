"use client";

import { Search } from "lucide-react";
import type { Event } from "../types";
import { EventCard } from "./EventCard";
import { EmptyState } from "@/components/shared/EmptyState";

interface EventGridProps {
  events: Event[];
  variant?: "light" | "dark";
  emptyTitle?: string;
  emptyDescription?: string;
}

export function EventGrid({
  events,
  variant = "light",
  emptyTitle = "Belum ada konser",
  emptyDescription = "Coba ubah kata kunci pencarian atau filter genre kamu.",
}: EventGridProps) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyTitle}
        description={emptyDescription}
        variant={variant}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventGrid;
