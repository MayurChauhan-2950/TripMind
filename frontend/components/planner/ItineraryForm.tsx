"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import InterestPicker from "@/components/ui/InterestPicker";
import Select from "@/components/ui/Select";
import type { BudgetLevel, Destination, Interest, ItineraryRequest } from "@/lib/types";

const BUDGET_LEVELS: BudgetLevel[] = ["Low", "Medium", "High"];

export default function ItineraryForm({
  destinations,
  onSubmit,
  loading,
  preselectedDestination,
}: {
  destinations: Destination[];
  onSubmit: (payload: ItineraryRequest) => void;
  loading: boolean;
  preselectedDestination?: string;
}) {
  const defaultDest =
    (preselectedDestination &&
      destinations.find((d) => d.name === preselectedDestination)?.name) ??
    destinations[0]?.name ??
    "";

  const [destination, setDestination] = useState(defaultDest);
  // Store days as a string so the input stays editable naturally
  const [daysInput, setDaysInput] = useState("3");
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("Medium");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(interest: Interest) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function handleDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow empty string while editing; strip leading zeros
    if (raw === "") {
      setDaysInput("");
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 1 && num <= 21) {
      setDaysInput(String(num));
    }
  }

  function handleDaysBlur() {
    // On blur: if empty or 0, reset to 1
    const num = parseInt(daysInput, 10);
    if (!daysInput || isNaN(num) || num < 1) {
      setDaysInput("1");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (interests.length === 0) {
      setError("Pick at least one interest.");
      return;
    }
    const days = parseInt(daysInput, 10);
    if (!days || days < 1 || days > 21) {
      setError("Trip days must be between 1 and 21.");
      return;
    }
    setError(null);
    onSubmit({ destination, days, budget_level: budgetLevel, interests });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {preselectedDestination && (
        <p className="font-body text-body-sm text-gold">
          ✦ Pre-filled from your selection: <strong>{preselectedDestination}</strong>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Destination
          </label>
          <Select value={destination} onChange={(e) => setDestination(e.target.value)}>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Trip days <span className="normal-case text-slate/60">(1–21)</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={21}
            value={daysInput}
            onChange={handleDaysChange}
            onBlur={handleDaysBlur}
            placeholder="e.g. 5"
            className="w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 placeholder:text-slate focus:border-gold focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Budget
          </label>
          <Select value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}>
            {BUDGET_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <p className="mb-2 font-body text-label uppercase tracking-[0.04em] text-slate">
          Interests
        </p>
        <InterestPicker selected={interests} onToggle={toggleInterest} />
        {error && <p className="mt-2 font-body text-body-sm text-rust">{error}</p>}
      </div>

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? "Generating…" : "Generate itinerary"}
      </Button>
    </form>
  );
}
