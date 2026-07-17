"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import TripCard from "@/components/trips/TripCard";
import RevealOnScroll from "@/components/motifs/RevealOnScroll";
import { deleteTrip, listTrips } from "@/lib/api/trips";
import { getDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import type { Destination, TripListItem } from "@/lib/types";

export default function TripsPage() {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTrips()
      .then(setTrips)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong."))
      .finally(() => setLoading(false));
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete trip.");
    }
  }

  function imageForDestination(name: string) {
    return destinations.find((dest) => dest.name === name)?.image_url;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Saved Trips"
        title="Your saved itineraries"
        subtext="Every itinerary you save from the Planner shows up here."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        {error && <p className="mb-6 font-body text-body-md text-rust">{error}</p>}

        {loading ? (
          <p className="font-body text-body-md text-slate">Loading…</p>
        ) : trips.length === 0 ? (
          <p className="font-body text-body-md text-slate">
            No saved trips yet.{" "}
            <Link href="/planner" className="text-gold underline">
              Generate an itinerary
            </Link>{" "}
            to save your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <RevealOnScroll key={trip.id} delay={(index % 3) * 0.06}>
                <TripCard
                  trip={trip}
                  onDelete={handleDelete}
                  imageUrl={imageForDestination(trip.destination)}
                />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
