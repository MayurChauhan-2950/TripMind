"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DestinationFilterForm from "@/components/destinations/DestinationFilterForm";
import RecommendResultsList from "@/components/destinations/RecommendResultsList";
import { recommendDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import type { RecommendRequest, RecommendResult } from "@/lib/types";

export default function ExplorePage() {
  const [results, setResults] = useState<RecommendResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(payload: RecommendRequest) {
    setLoading(true);
    setError(null);
    try {
      const data = await recommendDestinations(payload);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Destination Explorer"
        title="Find destinations that match how you travel"
        subtext="Tell us your interests, budget, and season — our recommendation engine scores every destination against what matters to you."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <div className="rounded-card border border-stone bg-card p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8">
          <DestinationFilterForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {error && <p className="mt-6 font-body text-body-md text-rust">{error}</p>}

        {hasSearched && !error && (
          <div className="mt-12">
            <h2 className="mb-6 font-display text-display-md text-navy">Your matches</h2>
            <RecommendResultsList results={results} />
          </div>
        )}
      </div>
    </div>
  );
}
