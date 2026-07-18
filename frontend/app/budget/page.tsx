"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AILoadingState from "@/components/ui/AILoadingState";
import ErrorState from "@/components/ui/ErrorState";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetBreakdownTable from "@/components/budget/BudgetBreakdownTable";
import { calculateBudget } from "@/lib/api/budget";
import { getDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import type { BudgetBreakdown, BudgetCalculateRequest, Destination } from "@/lib/types";

export default function BudgetPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [breakdown, setBreakdown] = useState<BudgetBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  async function handleSubmit(payload: BudgetCalculateRequest) {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateBudget(payload);
      setBreakdown(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Budget Calculator"
        title="Know the real cost before you go"
        subtext="Pick a destination, trip length, and budget tier — get a deterministic cost breakdown, plus one AI-generated tip to trim it."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <div className="rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8">
          {destinations.length > 0 ? (
            <BudgetForm destinations={destinations} onSubmit={handleSubmit} loading={loading} />
          ) : (
            <p className="font-body text-body-md text-slate">Loading destinations…</p>
          )}
        </div>

        {error && <ErrorState message={error} />}

        {loading && (
          <AILoadingState message="Crunching the numbers and asking Gemini for a cost-saving tip…" />
        )}

        {breakdown && (
          <div className="mt-12 max-w-xl">
            <h2 className="mb-6 font-display text-display-md text-navy">Cost breakdown</h2>
            <BudgetBreakdownTable breakdown={breakdown} />
          </div>
        )}
      </div>
    </div>
  );
}
