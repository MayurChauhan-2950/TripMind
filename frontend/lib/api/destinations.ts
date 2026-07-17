import { fetchJson } from "@/lib/api/client";
import type { Destination, RecommendRequest, RecommendResult } from "@/lib/types";

export function getDestinations(): Promise<Destination[]> {
  return fetchJson<Destination[]>("/api/destinations");
}

export function recommendDestinations(payload: RecommendRequest): Promise<RecommendResult[]> {
  return fetchJson<RecommendResult[]>("/api/destinations/recommend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
