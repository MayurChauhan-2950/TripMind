"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { getHiddenGems } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";
import type { Destination, HiddenGemsOut } from "@/lib/types";

export default function HiddenGemsPanel({ destinations }: { destinations: Destination[] }) {
  const [destination, setDestination] = useState(destinations[0]?.name ?? "");
  const [result, setResult] = useState<HiddenGemsOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getHiddenGems(destination);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
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
        <Button type="submit" disabled={loading}>
          {loading ? "Digging…" : "Find hidden gems"}
        </Button>
      </form>

      {error && <p className="mt-4 font-body text-body-sm text-rust">{error}</p>}

      {result && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {result.gems.map((gem, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <Gem className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.75} />
                <div>
                  <p className="font-display text-display-md text-navy">{gem.name}</p>
                  <p className="mt-1 font-body text-body-sm text-slate">{gem.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
