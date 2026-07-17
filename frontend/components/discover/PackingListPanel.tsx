"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { getPackingList } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";
import type { Destination, PackingListOut, Season } from "@/lib/types";

const SEASONS: Season[] = ["Winter", "Summer", "Monsoon", "Year-round"];

export default function PackingListPanel({ destinations }: { destinations: Destination[] }) {
  const [destination, setDestination] = useState(destinations[0]?.name ?? "");
  const [season, setSeason] = useState<Season>("Winter");
  const [daysInput, setDaysInput] = useState("5");
  const [result, setResult] = useState<PackingListOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const days = parseInt(daysInput, 10);
    if (!days || days < 1) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPackingList(destination, season, days);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setError("AI features are offline — no Gemini API key is configured.");
      } else {
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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

        <Button type="submit" disabled={loading} className="self-end">
          {loading ? "Packing…" : "Build packing list"}
        </Button>
      </form>

      {error && <p className="mt-4 font-body text-body-sm text-rust">{error}</p>}

      {result && (
        <Card className="mt-8 p-6 sm:p-8">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 font-body text-body-md text-navy">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-pine" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
