import { fetchJson } from "@/lib/api/client";
import type { BudgetRateOut, BudgetRateWrite, Destination, DestinationWrite } from "@/lib/types";

export function listBudgetRates(): Promise<BudgetRateOut[]> {
  return fetchJson<BudgetRateOut[]>("/api/budget/rates");
}

export function updateBudgetRate(tier: string, payload: BudgetRateWrite): Promise<BudgetRateOut> {
  return fetchJson<BudgetRateOut>(`/api/admin/budget-rates/${encodeURIComponent(tier)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function createDestination(payload: DestinationWrite): Promise<Destination> {
  return fetchJson<Destination>("/api/admin/destinations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteDestination(id: number): Promise<void> {
  return fetchJson<void>(`/api/admin/destinations/${id}`, { method: "DELETE" });
}
