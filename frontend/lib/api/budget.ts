import { fetchJson } from "@/lib/api/client";
import type { BudgetBreakdown, BudgetCalculateRequest } from "@/lib/types";

export function calculateBudget(payload: BudgetCalculateRequest): Promise<BudgetBreakdown> {
  return fetchJson<BudgetBreakdown>("/api/budget/calculate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
