"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import AILoadingState from "@/components/ui/AILoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ItineraryForm from "@/components/planner/ItineraryForm";
import ItineraryTimeline from "@/components/planner/ItineraryTimeline";
import SaveTripPanel from "@/components/planner/SaveTripPanel";
import { generateItinerary } from "@/lib/api/itinerary";
import { getDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
import type { Destination, ItineraryOut, ItineraryRequest } from "@/lib/types";

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <PlannerContent />
    </Suspense>
  );
}

function PlannerContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const preselectedDestination = searchParams.get("destination");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryOut | null>(null);
  const [lastRequest, setLastRequest] = useState<ItineraryRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  async function handleSubmit(payload: ItineraryRequest) {
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const data = await generateItinerary(payload);
      setItinerary(data);
      setLastRequest(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        // Surface specific Gemini errors clearly
        if (err.status === 503) {
          setError("AI features are offline — no Gemini API key is configured. Add GEMINI_API_KEY to your backend .env to enable itinerary generation.");
        } else if (err.status === 502) {
          setError("Gemini had trouble generating the itinerary. This sometimes happens with complex requests — try fewer days or different interests, then try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Itinerary Generator"
        title="A day-by-day plan, built by AI"
        subtext="Tell us where you're headed and what you're into — Gemini drafts a structured itinerary with activities, meals, and daily notes."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        {user && user.hobbies.length > 0 && (
          <p className="mb-6 rounded-card border border-gold/30 bg-gold/5 px-4 py-3 font-body text-body-sm text-gold">
            ✦ Personalizing using your profile hobbies: {user.hobbies.join(", ")}.
          </p>
        )}

        <div className="rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8">
          {destinations.length > 0 ? (
            <ItineraryForm
              destinations={destinations}
              onSubmit={handleSubmit}
              loading={loading}
              preselectedDestination={preselectedDestination ?? undefined}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {/* Skeleton loader for form */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-card bg-stone" />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 w-24 animate-pulse rounded-pill bg-stone" />
                ))}
              </div>
            </div>
          )}
        </div>

        {error && <ErrorState message={error} />}

        {loading && (
          <AILoadingState message="Gemini is drafting your itinerary — this usually takes 5–15 seconds…" />
        )}

        {itinerary && lastRequest && (
          <div className="mt-12">
            <h2 className="mb-6 font-display text-display-md text-navy">
              Your {itinerary.days.length}-day itinerary for {itinerary.destination}
            </h2>
            <div className="mb-8">
              <SaveTripPanel itinerary={itinerary} request={lastRequest} />
            </div>
            <ItineraryTimeline itinerary={itinerary} />
          </div>
        )}
      </div>
    </div>
  );
}
