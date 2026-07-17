"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import type { CompareRequest, Destination } from "@/lib/types";

export default function CompareForm({
  destinations,
  onSubmit,
  loading,
}: {
  destinations: Destination[];
  onSubmit: (payload: CompareRequest) => void;
  loading: boolean;
}) {
  const [destinationA, setDestinationA] = useState(destinations[0]?.name ?? "");
  const [destinationB, setDestinationB] = useState(destinations[1]?.name ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (destinationA === destinationB) {
      setError("Pick two different destinations.");
      return;
    }
    setError(null);
    onSubmit({ destination_a: destinationA, destination_b: destinationB });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Destination A
          </label>
          <Select value={destinationA} onChange={(e) => setDestinationA(e.target.value)}>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block font-body text-label uppercase tracking-[0.04em] text-slate">
            Destination B
          </label>
          <Select value={destinationB} onChange={(e) => setDestinationB(e.target.value)}>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && <p className="font-body text-body-sm text-rust">{error}</p>}

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? "Comparing…" : "Compare destinations"}
      </Button>
    </form>
  );
}
