import { fetchJson } from "@/lib/api/client";
import type { CollaboratorOut, TripCreate, TripListItem, TripOut } from "@/lib/types";

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

export function listCollaborators(tripId: number): Promise<CollaboratorOut[]> {
  return fetchJson<CollaboratorOut[]>(`/api/trips/${tripId}/collaborators`);
}

export function addCollaborator(tripId: number, email: string): Promise<CollaboratorOut> {
  return fetchJson<CollaboratorOut>(`/api/trips/${tripId}/collaborators`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function removeCollaborator(tripId: number, userId: number): Promise<void> {
  return fetchJson<void>(`/api/trips/${tripId}/collaborators/${userId}`, { method: "DELETE" });
}
