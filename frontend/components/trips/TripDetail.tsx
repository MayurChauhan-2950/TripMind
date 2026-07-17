import Tag from "@/components/ui/Tag";
import ItineraryTimeline from "@/components/planner/ItineraryTimeline";
import type { TripOut } from "@/lib/types";

export default function TripDetail({ trip }: { trip: TripOut }) {
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

      <div className="mt-10 max-w-2xl">
        <ItineraryTimeline itinerary={{ destination: trip.destination, days: trip.itinerary }} />
      </div>
    </div>
  );
}
