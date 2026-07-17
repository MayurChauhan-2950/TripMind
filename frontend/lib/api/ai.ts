import { fetchJson } from "@/lib/api/client";
import type { HiddenGemsOut, PackingListOut, Season } from "@/lib/types";

export function getHiddenGems(destination: string): Promise<HiddenGemsOut> {
  return fetchJson<HiddenGemsOut>("/api/ai/hidden-gems", {
    method: "POST",
    body: JSON.stringify({ destination }),
  });
}

export function getPackingList(
  destination: string,
  season: Season,
  days: number
): Promise<PackingListOut> {
  return fetchJson<PackingListOut>("/api/ai/packing-list", {
    method: "POST",
    body: JSON.stringify({ destination, season, days }),
  });
}
