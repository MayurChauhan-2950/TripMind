"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import { createDestination, deleteDestination, listBudgetRates, updateBudgetRate } from "@/lib/api/admin";
import { getDestinations } from "@/lib/api/destinations";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
import type { BudgetRateOut, Destination, DestinationWrite } from "@/lib/types";

const EMPTY_DESTINATION: DestinationWrite = {
  name: "",
  state: "",
  category: "",
  budget_level: "Medium",
  best_season: "Year-round",
  family_friendly: true,
  adventure_score: 50,
  food_score: 50,
  shopping_score: 50,
  nature_score: 50,
  historical_score: 50,
  description: "",
  image_url: "",
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [rates, setRates] = useState<BudgetRateOut[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newDestination, setNewDestination] = useState<DestinationWrite>(EMPTY_DESTINATION);
  const [error, setError] = useState<string | null>(null);
  const [savingTier, setSavingTier] = useState<string | null>(null);

  async function loadAll() {
    try {
      const [rateData, destData] = await Promise.all([listBudgetRates(), getDestinations()]);
      setRates(rateData);
      setDestinations(destData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  useEffect(() => {
    if (!authLoading && user) loadAll();
  }, [authLoading, user]);

  async function handleSaveRate(rate: BudgetRateOut) {
    setSavingTier(rate.tier);
    setError(null);
    try {
      const updated = await updateBudgetRate(rate.tier, {
        hotel_per_day: rate.hotel_per_day,
        food_per_day: rate.food_per_day,
        transport_per_day: rate.transport_per_day,
        activities_per_day: rate.activities_per_day,
      });
      setRates((prev) => prev.map((r) => (r.tier === updated.tier ? updated : r)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSavingTier(null);
    }
  }

  function updateRateField(tier: string, field: keyof BudgetRateOut, value: number) {
    setRates((prev) => prev.map((r) => (r.tier === tier ? { ...r, [field]: value } : r)));
  }

  async function handleCreateDestination(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const created = await createDestination(newDestination);
      setDestinations((prev) => [...prev, created]);
      setNewDestination(EMPTY_DESTINATION);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  async function handleDeleteDestination(id: number) {
    setError(null);
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        <ErrorState message="You must be logged in to view this page." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Manage destinations & budget rates"
        subtext="Content updates without touching seed files or the database directly. Requires an admin account."
      />

      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-16">
        {error && <ErrorState message={error} />}

        <h2 className="mb-4 font-display text-display-md text-navy">Budget rates</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rates.map((rate) => (
            <Card key={rate.tier} className="p-5">
              <p className="mb-3 font-body text-label uppercase tracking-[0.04em] text-slate">
                {rate.tier}
              </p>
              {(
                [
                  ["hotel_per_day", "Hotel / day"],
                  ["food_per_day", "Food / day"],
                  ["transport_per_day", "Transport / day"],
                  ["activities_per_day", "Activities / day"],
                ] as const
              ).map(([field, label]) => (
                <div key={field} className="mb-2">
                  <label className="mb-1 block font-body text-body-sm text-slate">{label}</label>
                  <Input
                    type="number"
                    min={0}
                    value={rate[field]}
                    onChange={(e) =>
                      updateRateField(rate.tier, field, Number(e.target.value) || 0)
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                className="mt-2 w-full"
                disabled={savingTier === rate.tier}
                onClick={() => handleSaveRate(rate)}
              >
                {savingTier === rate.tier ? "Saving…" : "Save"}
              </Button>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 mt-12 font-display text-display-md text-navy">Destinations</h2>
        <Card className="overflow-x-auto p-5">
          <table className="w-full text-left font-body text-body-sm text-navy">
            <thead>
              <tr className="border-b border-stone text-label uppercase tracking-[0.04em] text-slate">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Budget</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest) => (
                <tr key={dest.id} className="border-b border-stone/50">
                  <td className="py-2 pr-4">{dest.name}</td>
                  <td className="py-2 pr-4">{dest.state}</td>
                  <td className="py-2 pr-4">{dest.category}</td>
                  <td className="py-2 pr-4">{dest.budget_level}</td>
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => handleDeleteDestination(dest.id)}
                      className="font-body text-body-sm text-rust underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <h2 className="mb-4 mt-12 font-display text-display-md text-navy">Add a destination</h2>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleCreateDestination} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder="Name"
              required
              value={newDestination.name}
              onChange={(e) => setNewDestination((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              placeholder="State"
              required
              value={newDestination.state}
              onChange={(e) => setNewDestination((p) => ({ ...p, state: e.target.value }))}
            />
            <Input
              placeholder="Category"
              required
              value={newDestination.category}
              onChange={(e) => setNewDestination((p) => ({ ...p, category: e.target.value }))}
            />
            <Input
              placeholder="Best season (e.g. Summer, Winter)"
              required
              value={newDestination.best_season}
              onChange={(e) => setNewDestination((p) => ({ ...p, best_season: e.target.value }))}
            />
            <Input
              placeholder="Image URL"
              required
              className="sm:col-span-2"
              value={newDestination.image_url}
              onChange={(e) => setNewDestination((p) => ({ ...p, image_url: e.target.value }))}
            />
            <textarea
              placeholder="Description"
              required
              className="sm:col-span-2 w-full rounded-card border border-stone bg-card px-4 py-2.5 font-body text-body-md text-navy outline-none transition-colors duration-150 placeholder:text-slate focus:border-gold focus:ring-2 focus:ring-gold"
              rows={3}
              value={newDestination.description}
              onChange={(e) => setNewDestination((p) => ({ ...p, description: e.target.value }))}
            />
            <Button type="submit" className="sm:col-span-2">
              Add destination
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
