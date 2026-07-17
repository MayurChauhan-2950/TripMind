"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import InterestPicker from "@/components/ui/InterestPicker";
import Select from "@/components/ui/Select";
import type { BudgetLevel, Interest, RecommendRequest, Season } from "@/lib/types";

const BUDGET_LEVELS: BudgetLevel[] = ["Low", "Medium", "High"];
const SEASONS: Season[] = ["Winter", "Summer", "Monsoon", "Year-round"];

export default function DestinationFilterForm({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: RecommendRequest) => void;
  loading: boolean;
}) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("Medium");
  const [season, setSeason] = useState<Season>("Winter");
  const [tripDaysInput, setTripDaysInput] = useState("5");
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(interest: Interest) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (interests.length === 0) {
      setError("Pick at least one interest.");
      return;
    }
    const tripDays = parseInt(tripDaysInput, 10);
    if (!tripDays || tripDays < 1) {
      setError("Trip days must be at least 1.");
      return;
    }
    setError(null);
    onSubmit({ interests, budget_level: budgetLevel, season, trip_days: tripDays });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-body text-label uppercase tracking-[0.04em] text-slate">
          Interests
        </p>
        <InterestPicker selected={interests} onToggle={toggleInterest} />
        {error && <p className="mt-2 font-body text-body-sm text-rust">{error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Budget
          </label>
          <Select
            value={budgetLevel}
            onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
          >
            {BUDGET_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Season
          </label>
          <Select value={season} onChange={(e) => setSeason(e.target.value as Season)}>
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Trip days
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={tripDaysInput}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") { setTripDaysInput(""); return; }
              const num = parseInt(raw, 10);
              if (!isNaN(num) && num >= 1) setTripDaysInput(String(num));
            }}
            onBlur={() => {
              const num = parseInt(tripDaysInput, 10);
              if (!tripDaysInput || isNaN(num) || num < 1) setTripDaysInput("1");
            }}
            placeholder="e.g. 5"
            className="w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 placeholder:text-slate focus:border-gold focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? "Finding matches…" : "Find destinations"}
      </Button>
    </form>
  );
}
