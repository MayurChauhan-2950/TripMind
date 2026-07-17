"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createTrip } from "@/lib/api/trips";
import { ApiError } from "@/lib/api/client";
import type { ItineraryOut, ItineraryRequest } from "@/lib/types";

export default function SaveTripPanel({
  itinerary,
  request,
}: {
  itinerary: ItineraryOut;
  request: ItineraryRequest;
}) {
  const [tripName, setTripName] = useState(`${itinerary.destination} Trip`);
  const [travelerName, setTravelerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createTrip({
        trip_name: tripName,
        destination: itinerary.destination,
        budget_tier: request.budget_level,
        days: request.days,
        traveler_name: travelerName || null,
        itinerary: itinerary.days,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save trip.");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <p className="rounded-card border border-dashed border-gold bg-paper p-4 font-body text-body-sm text-navy">
        Saved! Find it under <span className="text-gold">Trips</span>.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-3 rounded-card border border-stone bg-card p-5 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex-1">
        <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
          Trip name
        </label>
        <Input value={tripName} onChange={(e) => setTripName(e.target.value)} required />
      </div>
      <div className="flex-1">
        <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
          Traveler name (optional)
        </label>
        <Input
          value={travelerName}
          onChange={(e) => setTravelerName(e.target.value)}
          placeholder="Anonymous Traveler"
        />
      </div>
      <Button type="submit" variant="secondary" disabled={saving}>
        {saving ? "Saving…" : "Save this trip"}
      </Button>
      {error && <p className="font-body text-body-sm text-rust">{error}</p>}
    </form>
  );
}
