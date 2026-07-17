"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import CompareForm from "@/components/compare/CompareForm";
import CompareTable from "@/components/compare/CompareTable";
import CompareAISummary from "@/components/compare/CompareAISummary";
import { compareDestinations } from "@/lib/api/compare";
import { getDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import type { CompareOut, CompareRequest, Destination } from "@/lib/types";

export default function ComparePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [result, setResult] = useState<CompareOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  async function handleSubmit(payload: CompareRequest) {
    setLoading(true);
    setError(null);
    try {
      const data = await compareDestinations(payload);
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Compare Destinations"
        title="Two destinations, side by side"
        subtext="The comparison table is pulled straight from our destination data. The take underneath is Gemini's read on which traveler each one suits."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <div className="rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8">
          {destinations.length > 0 ? (
            <CompareForm destinations={destinations} onSubmit={handleSubmit} loading={loading} />
          ) : (
            <p className="font-body text-body-md text-slate">Loading destinations…</p>
          )}
        </div>

        {error && <p className="mt-6 font-body text-body-md text-rust">{error}</p>}

        {result && (
          <div className="mt-12">
            <h2 className="mb-6 font-display text-display-md text-navy">
              {result.destination_a.name} vs {result.destination_b.name}
            </h2>
            <CompareTable result={result} />
            <CompareAISummary summary={result.ai_summary} />
          </div>
        )}
      </div>
    </div>
  );
}
