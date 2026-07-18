import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";
import ItineraryTimeline from "@/components/planner/ItineraryTimeline";
import { buildIcsContent, downloadIcsFile } from "@/lib/ics";
import type { TripOut } from "@/lib/types";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TripDetail({ trip }: { trip: TripOut }) {
  const [startDate, setStartDate] = useState(todayIsoDate());

  function handleExport() {
    const content = buildIcsContent(trip, new Date(`${startDate}T00:00:00`));
    downloadIcsFile(`${trip.trip_name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`, content);
  }

  return (
    <div>
      <p className="font-body text-label uppercase tracking-[0.04em] text-gold">
        {trip.traveler_name}
      </p>
      <h1 className="mt-2 font-display text-display-lg text-navy">{trip.trip_name}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag dot="harbor">{trip.destination}</Tag>
        <Tag dot="rust">{trip.budget_tier} budget</Tag>
        <Tag dot="none">{trip.days} days</Tag>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block font-body text-body-sm text-slate">
            Trip start date (for calendar export)
          </label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <Button type="button" variant="secondary" onClick={handleExport}>
          Export to calendar (.ics)
        </Button>
      </div>

      <div className="mt-10 max-w-2xl">
        <ItineraryTimeline itinerary={{ destination: trip.destination, days: trip.itinerary }} />
      </div>
    </div>
  );
}
