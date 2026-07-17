"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import type { BudgetCalculateRequest, BudgetLevel, Destination } from "@/lib/types";

const BUDGET_TIERS: BudgetLevel[] = ["Low", "Medium", "High"];

export default function BudgetForm({
  destinations,
  onSubmit,
  loading,
}: {
  destinations: Destination[];
  onSubmit: (payload: BudgetCalculateRequest) => void;
  loading: boolean;
}) {
  const [destination, setDestination] = useState(destinations[0]?.name ?? "");
  const [daysInput, setDaysInput] = useState("5");
  const [budgetTier, setBudgetTier] = useState<BudgetLevel>("Medium");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const days = parseInt(daysInput, 10);
    if (!days || days < 1) return;
    onSubmit({ destination, days, budget_tier: budgetTier });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          Trip days
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={daysInput}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { setDaysInput(""); return; }
            const num = parseInt(raw, 10);
            if (!isNaN(num) && num >= 1) setDaysInput(String(num));
          }}
          onBlur={() => {
            const num = parseInt(daysInput, 10);
            if (!daysInput || isNaN(num) || num < 1) setDaysInput("1");
          }}
          placeholder="e.g. 5"
          className="w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 placeholder:text-slate focus:border-gold focus:ring-2 focus:ring-gold"
        />
      </div>

      <div>
        <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
          Budget tier
        </label>
        <Select value={budgetTier} onChange={(e) => setBudgetTier(e.target.value as BudgetLevel)}>
          {BUDGET_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="sm:col-span-3 self-start">
        {loading ? "Calculating…" : "Calculate budget"}
      </Button>
    </form>
  );
}
