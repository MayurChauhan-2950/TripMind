import { fetchJson } from "@/lib/api/client";
import type { TripCreate, TripListItem, TripOut } from "@/lib/types";

export function createTrip(payload: TripCreate): Promise<TripOut> {
  return fetchJson<TripOut>("/api/trips", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listTrips(): Promise<TripListItem[]> {
  return fetchJson<TripListItem[]>("/api/trips");
}

export function getTrip(id: number): Promise<TripOut> {
  return fetchJson<TripOut>(`/api/trips/${id}`);
}

export function deleteTrip(id: number): Promise<void> {
  return fetchJson<void>(`/api/trips/${id}`, { method: "DELETE" });
}
