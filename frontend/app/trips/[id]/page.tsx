"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ErrorState from "@/components/ui/ErrorState";
import TripDetail from "@/components/trips/TripDetail";
import { getTrip } from "@/lib/api/trips";
import { ApiError } from "@/lib/api/client";
import type { TripOut } from "@/lib/types";

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripOut | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrip(Number(params.id))
      .then(setTrip)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong."));
  }, [params.id]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
      {error && <ErrorState message={error} />}
      {!trip && !error && <p className="font-body text-body-md text-slate">Loading…</p>}
      {trip && <TripDetail trip={trip} />}
    </div>
  );
}
