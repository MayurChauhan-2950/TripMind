"use client";

import Link from "next/link";
import { Luggage, Trash2 } from "lucide-react";
import StampedCard from "@/components/motifs/StampedCard";
import Tag from "@/components/ui/Tag";
import type { TripListItem } from "@/lib/types";

export default function TripCard({
  trip,
  onDelete,
  imageUrl,
}: {
  trip: TripListItem;
  onDelete: (id: number) => void;
  imageUrl?: string;
}) {
  return (
    <StampedCard
      stamp={{ type: "icon", icon: Luggage }}
      image={imageUrl ? { src: imageUrl, alt: trip.destination } : undefined}
    >
      <div className="p-5">
        <p className="font-body text-label uppercase tracking-[0.04em] text-slate">
          {new Date(trip.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <Link href={`/trips/${trip.id}`}>
          <h3 className="mt-1 font-display text-display-md text-navy hover:text-gold">
            {trip.trip_name}
          </h3>
        </Link>
        <p className="mt-2 font-body text-body-sm text-slate">
          {trip.destination} · {trip.days} days · {trip.traveler_name}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <Tag dot="rust">{trip.budget_tier} budget</Tag>
          <button
            type="button"
            onClick={() => onDelete(trip.id)}
            className="text-slate transition-colors duration-150 hover:text-rust"
            aria-label="Delete trip"
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </StampedCard>
  );
}
