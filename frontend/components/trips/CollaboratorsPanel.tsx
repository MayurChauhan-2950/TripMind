"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import { addCollaborator, listCollaborators, removeCollaborator } from "@/lib/api/trips";
import { ApiError } from "@/lib/api/client";
import type { CollaboratorOut } from "@/lib/types";

export default function CollaboratorsPanel({ tripId }: { tripId: number }) {
  const [collaborators, setCollaborators] = useState<CollaboratorOut[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listCollaborators(tripId)
      .then(setCollaborators)
      .catch(() => setCollaborators([]));
  }, [tripId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const added = await addCollaborator(tripId, email);
      setCollaborators((prev) => [...prev, added]);
      setEmail("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(userId: number) {
    setError(null);
    try {
      await removeCollaborator(tripId, userId);
      setCollaborators((prev) => prev.filter((c) => c.user_id !== userId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  return (
    <Card className="mt-6 p-5">
      <p className="mb-3 font-body text-label uppercase tracking-[0.04em] text-slate">
        Shared with
      </p>

      {collaborators.length === 0 ? (
        <p className="font-body text-body-sm text-slate">No collaborators yet.</p>
      ) : (
        <ul className="mb-4 flex flex-col gap-2">
          {collaborators.map((c) => (
            <li key={c.user_id} className="flex items-center justify-between">
              <span className="font-body text-body-sm text-navy">
                {c.username} ({c.email})
              </span>
              <button
                type="button"
                onClick={() => handleRemove(c.user_id)}
                className="font-body text-body-sm text-rust underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <ErrorState message={error} />}

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="Invite by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="secondary" disabled={submitting}>
          {submitting ? "Adding…" : "Add"}
        </Button>
      </form>
    </Card>
  );
}
