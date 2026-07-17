import { fetchJson } from "@/lib/api/client";
import type { ItineraryOut, ItineraryRequest } from "@/lib/types";

export function generateItinerary(payload: ItineraryRequest): Promise<ItineraryOut> {
  return fetchJson<ItineraryOut>("/api/ai/itinerary", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
