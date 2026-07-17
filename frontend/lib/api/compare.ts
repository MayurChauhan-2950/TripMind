import { fetchJson } from "@/lib/api/client";
import type { CompareOut, CompareRequest } from "@/lib/types";

export function compareDestinations(payload: CompareRequest): Promise<CompareOut> {
  return fetchJson<CompareOut>("/api/compare", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
